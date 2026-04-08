"use server";
import { db } from "@/lib/prisma";
import { currentUser } from "../hooks/auth";

export async function changeSubjectStatus(
  id: string,
  status: "ACTIVE" | "INACTIVE"
) {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }
  try {
    const subject = await db.subject.findUnique({ where: { id } });

    if (!subject) {
      return {
        success: false,
        message: "Không tìm thấy khóa học",
      };
    }

    await db.subject.update({
      where: { id },
      data: { status },
    });

    return {
      success: true,
      message: "Cập nhật trạng thái thành công",
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái khóa học:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi cập nhật trạng thái",
    };
  }
}
