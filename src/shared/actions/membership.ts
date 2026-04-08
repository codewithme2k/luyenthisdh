"use server";

import db from "@/lib/prisma";
import { currentUser } from "../hooks/auth";
import { sendTelegramMessage } from "@/lib/sendTelegramMessage";
import { EOrderStatus, EOrderType, EVipPlan } from "@/generated/prisma/enums";

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
  const timestamp = Date.now().toString().slice(-6); // lấy 6 số cuối timestamp
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 chữ số ngẫu nhiên
  return `DH${timestamp}${randomPart}`;
}
export async function memberShip(planId: string) {
  const user = await currentUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // 1. Kiểm tra xem có order PENDING không
    const pendingOrder = await db.order.findFirst({
      where: {
        userId: user.id,
        status: EOrderStatus.PENDING,
      },
    });

    if (pendingOrder) {
      return {
        success: false,
        message:
          "Bạn vẫn có đơn hàng chưa thanh toán. Vui lòng hoàn tất thanh toán trước khi mua gói mới.",
      };
    }

    // 2. Tính giá và thời hạn gói
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

    // 3. Kiểm tra membership hiện tại (không update ngay)
    const existingMembership = await db.membership.findUnique({
      where: { userId: user.id },
    });

    if (existingMembership && existingMembership.plan === planId) {
      return {
        success: false,
        message: "Bạn đã đăng ký gói này rồi.",
      };
    }

    // 4. Tạo order mới
    const price = getVipPrice(planId as EVipPlan);
    const order = await db.order.create({
      data: {
        userId: user.id,
        type: EOrderType.VIP,
        membershipId: existingMembership?.id || undefined,
        price,
        status: EOrderStatus.PENDING,
        code: generateOrderCode(),
      },
    });

    // 5. Gửi thông báo Telegram
    await sendTelegramMessage(
      `📚 *Người dùng:* ${escape(user.name || user.email || "")}\n` +
        `🎓 *Gói VIP:* ${planId}\n` +
        `🧾 *Mã đơn hàng:* \`${order.code}\`\n` +
        `💰 *Giá thanh toán:* *${price.toLocaleString()}đ*\n` +
        `📌 *Trạng thái:* 🕓 *Chờ thanh toán*`,
    );

    return {
      success: true,
      message: "Tạo đơn hàng thành công. Vui lòng thanh toán để kích hoạt VIP.",
      data: {
        order: order.id,
      },
    };
  } catch (error) {
    console.error("Lỗi khi tạo membership order:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi tạo đơn hàng VIP",
    };
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
