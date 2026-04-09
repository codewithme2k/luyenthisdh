"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "../hooks/auth";
import { EOrderStatus } from "@/generated/prisma"; // Đảm bảo import đúng Enum

export async function changeOrderStatus(
  id: string,
  status: "SUCCESS" | "PENDING" | "FAILED",
) {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // 1. Tìm order kèm membership trước
    const order = await db.order.findUnique({
      where: { id },
      include: {
        Membership: true,
      },
    });

    if (!order) {
      return { success: false, message: "Không tìm thấy đơn hàng" };
    }

    // 2. Sử dụng $transaction để đảm bảo an toàn dữ liệu trên Postgres
    await db.$transaction(async (tx) => {
      // Cập nhật trạng thái Order
      // Ép kiểu status về EOrderStatus để Postgres/Prisma không bắt lỗi type
      await tx.order.update({
        where: { id },
        data: { status: status as EOrderStatus },
      });

      // Nếu là đơn VIP → cập nhật trạng thái kích hoạt Membership
      if (order.type === "VIP" && order.Membership) {
        await tx.membership.update({
          where: { id: order.Membership.id },
          data: {
            // So sánh trực tiếp với string hoặc enum đồng nhất
            isActive: status === "SUCCESS",
          },
        });
      }

      // Nếu sau này bạn mở lại phần Enrollment (COURSE)
      // thì cũng dùng tx.enrollment.update ở đây...
    });

    return {
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi xử lý yêu cầu",
    };
  }
}
