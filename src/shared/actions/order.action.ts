"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "../hooks/auth";
import { EOrderStatus } from "@/generated/prisma";

export async function changeOrderStatus(
  id: string,
  status: "SUCCESS" | "PENDING" | "FAILED",
) {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        Membership: true,
      },
    });

    if (!order) {
      return {
        success: false,
        message: "Không tìm thấy đơn hàng",
      };
    }

    // Cập nhật trạng thái Order
    await db.order.update({
      where: { id },
      data: { status },
    });

    // Nếu là đơn VIP → cập nhật trạng thái kích hoạt Membership
    if (order.type === "VIP" && order.Membership) {
      await db.membership.update({
        where: { id: order.Membership.id },
        data: {
          isActive: status === EOrderStatus.SUCCESS,
        },
      });
    }

    // // Nếu là đơn mua khóa học → cập nhật trạng thái thanh toán Enrollment
    // if (order.type === "COURSE" && order.Enrollment) {
    //   await db.enrollment.update({
    //     where: { id: order.Enrollment.id },
    //     data: {
    //       paymentStatus: status === EOrderStatus.SUCCESS ? "PAID" : "PENDING",
    //     },
    //   });
    // }

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
