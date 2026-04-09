"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "../hooks/auth";
import { sendTelegramMessage } from "@/lib/sendTelegramMessage";
import { EOrderStatus, EOrderType, EVipPlan } from "@/generated/prisma";

function getVipPrice(plan: EVipPlan): number {
  switch (plan) {
    case EVipPlan.MONTHLY:
      return 50000;
    case EVipPlan.HALF_YEAR:
      return 250000;
    case EVipPlan.YEARLY:
      return 450000;
    case EVipPlan.LIFETIME:
      return 900000;
    default:
      return 0;
  }
}

function generateOrderCode(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `DH${timestamp}${randomPart}`;
}

export async function memberShip(planId: string) {
  const user = await currentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  try {
    const pendingOrder = await db.order.findFirst({
      where: { userId: user.id, status: EOrderStatus.PENDING },
    });
    if (pendingOrder) {
      return { success: false, message: "Bạn còn đơn hàng chưa thanh toán." };
    }

    const now = new Date();
    let endDate: Date | null = null;

    switch (planId) {
      case EVipPlan.MONTHLY:
        endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case EVipPlan.HALF_YEAR:
        endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case EVipPlan.YEARLY:
        endDate = new Date(now);
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case EVipPlan.LIFETIME:
        endDate = null;
        break;
      default:
        return { success: false, message: "Gói không hợp lệ" };
    }

    const result = await db.$transaction(async (tx) => {
      let membership = await tx.membership.findUnique({
        where: { userId: user.id },
      });

      if (!membership) {
        membership = await tx.membership.create({
          data: {
            userId: user.id,
            plan: planId as EVipPlan,
            startDate: now,
            endDate: endDate,
            isActive: false,
          },
        });
      } else {
        membership = await tx.membership.update({
          where: { id: membership.id },
          data: {
            plan: planId as EVipPlan,
            endDate: endDate,
            isActive: false,
          },
        });
      }

      const price = getVipPrice(planId as EVipPlan);
      const order = await tx.order.create({
        data: {
          userId: user.id,
          type: EOrderType.VIP,
          membershipId: membership.id,
          price,
          status: EOrderStatus.PENDING,
          code: generateOrderCode(),
        },
      });

      return { order, price };
    });

    // 4. Gửi thông báo Telegram
    await sendTelegramMessage(
      `📚 *Người dùng:* ${user.name || user.email}\n` +
        `🎓 *Gói VIP:* ${planId}\n` +
        `🧾 *Mã đơn hàng:* \`${result.order.code}\`\n` +
        `💰 *Giá:* *${result.price.toLocaleString()}đ*\n` +
        `📌 *Trạng thái:* 🕓 *Chờ thanh toán*`,
    );

    return {
      success: true,
      message: "Tạo đơn hàng thành công.",
      data: { order: result.order.id },
    };
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    return { success: false, message: "Đã xảy ra lỗi hệ thống." };
  }
}
export async function CheckMemberShip() {
  const user = await currentUser();
  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
      plan: null,
      isExpired: null,
    };
  }

  const membership = await db.membership.findUnique({
    where: { userId: user.id, isActive: true },
  });

  if (!membership) {
    return {
      success: false,
      plan: null,
      isExpired: null,
    };
  }

  const now = new Date();
  const isExpired = membership.endDate !== null && membership.endDate < now;
  return {
    success: true,
    plan: membership.plan,
    isExpired,
  };
}
