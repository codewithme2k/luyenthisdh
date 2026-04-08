"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ================= CREATE =================
export async function createLecture(data: {
  title: string;
  courseId: string;
  order?: number;
}) {
  try {
    let order = data.order;

    if (order === undefined) {
      const lastLecture = await db.lecture.findFirst({
        where: { courseId: data.courseId },
        orderBy: { order: "desc" },
      });
      order = lastLecture ? lastLecture.order + 1 : 0;
    }

    const lecture = await db.lecture.create({
      data: {
        title: data.title,
        courseId: data.courseId,
        order,
      },
      include: {
        Lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath(`/admin/course/content`);
    return { success: true, data: lecture };
  } catch (error) {
    console.error("Error creating lecture:", error);
    return { success: false, error: "Không thể tạo chương học" };
  }
}

// ================= UPDATE =================
export async function updateLecture(
  lectureId: string,
  data: {
    title?: string;
    order?: number;
  },
) {
  try {
    const lecture = await db.lecture.update({
      where: { id: lectureId },
      data,
      include: {
        Lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath(`/admin/course/content`);
    return { success: true, data: lecture };
  } catch (error) {
    console.error("Error updating lecture:", error);
    return { success: false, error: "Không thể cập nhật chương học" };
  }
}

// ================= DELETE =================
export async function deleteLecture(lectureId: string) {
  try {
    // ❗ PostgreSQL: chỉ cần xóa lesson → lecture
    await db.lesson.deleteMany({
      where: { lectureId },
    });

    await db.lecture.delete({
      where: { id: lectureId },
    });

    // ❌ XÓA LOGIC lectureId array (Mongo) → không còn dùng

    revalidatePath(`/admin/course/content`);
    return { success: true, message: "Xoá thành công" };
  } catch (error) {
    console.error("Error deleting lecture:", error);
    return { success: false, message: "Không thể xóa chương học" };
  }
}

// ================= REORDER =================
export async function reorderLectures(
  courseId: string,
  lectureOrders: { id: string; order: number }[],
) {
  try {
    await db.$transaction(
      lectureOrders.map((item) =>
        db.lecture.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    revalidatePath(`/admin/course/content`);
    return { success: true };
  } catch (error) {
    console.error("Error reordering lectures:", error);
    return { success: false, error: "Không thể sắp xếp lại thứ tự chương" };
  }
}

// ================= DUPLICATE =================
export async function duplicateLecture(lectureId: string) {
  try {
    const originalLecture = await db.lecture.findUnique({
      where: { id: lectureId },
      include: {
        Lessons: true,
      },
    });

    if (!originalLecture) {
      return { success: false, error: "Không tìm thấy chương học" };
    }

    const lastLecture = await db.lecture.findFirst({
      where: { courseId: originalLecture.courseId },
      orderBy: { order: "desc" },
    });

    const newOrder = (lastLecture?.order || 0) + 1;

    const newLecture = await db.lecture.create({
      data: {
        title: `${originalLecture.title} (Copy)`,
        courseId: originalLecture.courseId,
        order: newOrder,
        Lessons: {
          create: originalLecture.Lessons.map((lesson, index) => ({
            title: lesson.title,
            slug: `${lesson.slug}-copy-${Date.now()}`,
            type: lesson.type,
            video: lesson.video,
            duration: lesson.duration,
            content: lesson.content,
            status: lesson.status,
            order: index,
            courseId: originalLecture.courseId,
            views: 0,
            assetId: lesson.assetId,
            iframe: lesson.iframe,
            isFree: lesson.isFree ?? false,
          })),
        },
      },
      include: {
        Lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    revalidatePath(`/admin/course/content`);
    return { success: true, data: newLecture };
  } catch (error) {
    console.error("Error duplicating lecture:", error);
    return { success: false, error: "Không thể sao chép chương học" };
  }
}
