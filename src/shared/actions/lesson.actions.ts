"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function createLesson(data: {
  title: string;
  slug: string;
  lectureId: string;
  courseId: string;
  type?: string;
  video?: string;
  content?: string;
  iframe?: string;
  order?: number;
}) {
  try {
    let order = data.order;
    if (order === undefined) {
      const lastLesson = await db.lesson.findFirst({
        where: { lectureId: data.lectureId },
        orderBy: { order: "desc" },
      });
      order = lastLesson ? lastLesson.order + 1 : 0;
    }
    const baseSlug =
      data.slug ||
      slugify(data.title || "bai-hoc", {
        lower: true,
        strict: true,
        locale: "vi",
      });
    const randomSuffix = Math.random().toString(16).substring(2, 8);
    const lesson = await db.lesson.create({
      data: {
        title: data.title,
        slug: `${baseSlug}-${randomSuffix}`, // ví dụ: gioi-thieu-khoa-hoc-fj39dk
        lectureId: data.lectureId,
        courseId: data.courseId,
        type: data.type || "video",
        video: data.video || "",
        content: data.content,
        iframe: data.iframe,
        order,
        status: "draft",
        duration: 0,
        views: 0,
      },
    });
    return { success: true, data: lesson };
  } catch (error) {
    console.error("Error creating lesson:", error);
    return { success: false, error: "Không thể tạo bài học" };
  }
}

export async function updateLesson(
  lessonId: string,
  data: {
    title?: string;
    slug?: string;
    type?: string;
    video?: string;
    content?: string;
    iframe?: string;
    duration?: number;
    status?: string;
    order?: number;
    isFree: boolean;
  }
) {
  try {
    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: {
        ...data,
        ...(data.title && {
          slug: `${slugify(data.title, {
            lower: true,
            locale: "vi",
            strict: true,
          })}-${Math.random().toString(36).slice(-4)}`, // ví dụ slug: gioi-thieu-4f3d
        }),
        updateAt: new Date(),
      },
    });

    if (lesson) {
      return { success: true, message: lesson };
    } else {
      return { success: true, message: "Không tìm thấy bài học để cập nhật." };
    }
  } catch (error) {
    console.error("Error updating lesson:", error);
    return { success: false, message: "Không thể cập nhật bài học" };
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    await db.lesson.delete({
      where: { id: lessonId },
    });

    return { success: true, message: "Đã xoá thành công" };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return { success: false, message: "Không thể xóa bài học" };
  }
}

export async function reorderLessons(
  lectureId: string,
  lessonOrders: { id: string; order: number }[]
) {
  try {
    // Update all lesson orders in a transaction
    await db.$transaction(
      lessonOrders.map((item) =>
        db.lesson.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath(`/admin/course/content`);
    return { success: true };
  } catch (error) {
    console.error("Error reordering lessons:", error);
    return { success: false, error: "Không thể sắp xếp lại thứ tự bài học" };
  }
}

export async function moveLessonToLecture(
  lessonId: string,
  newLectureId: string,
  newOrder?: number
) {
  try {
    // Get the course ID from the new lecture
    const newLecture = await db.lecture.findUnique({
      where: { id: newLectureId },
      select: { courseId: true },
    });

    if (!newLecture) {
      return { success: false, error: "Không tìm thấy chương học đích" };
    }

    // Get the next order number if not provided
    let order = newOrder;
    if (order === undefined) {
      const lastLesson = await db.lesson.findFirst({
        where: { lectureId: newLectureId },
        orderBy: { order: "desc" },
      });
      order = (lastLesson?.order || 0) + 1;
    }

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: {
        lectureId: newLectureId,
        courseId: newLecture.courseId,
        order,
        updateAt: new Date(),
      },
    });

    revalidatePath(`/admin/course/content`);
    return { success: true, data: lesson };
  } catch (error) {
    console.error("Error moving lesson:", error);
    return { success: false, error: "Không thể di chuyển bài học" };
  }
}

export async function duplicateLesson(lessonId: string) {
  try {
    const originalLesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!originalLesson) {
      return { success: false, error: "Không tìm thấy bài học" };
    }

    // Get the next order number
    const lastLesson = await db.lesson.findFirst({
      where: { lectureId: originalLesson.lectureId },
      orderBy: { order: "desc" },
    });
    const newOrder = (lastLesson?.order || 0) + 1;

    const newLesson = await db.lesson.create({
      data: {
        title: `${originalLesson.title} (Copy)`,
        slug: `${originalLesson.slug}-copy-${Date.now()}`,
        type: originalLesson.type,
        video: originalLesson.video,
        duration: originalLesson.duration,
        content: originalLesson.content,
        status: "draft",
        order: newOrder,
        courseId: originalLesson.courseId,
        lectureId: originalLesson.lectureId,
        views: 0,
        assetId: originalLesson.assetId,
        iframe: originalLesson.iframe,
      },
    });

    revalidatePath(`/admin/course/content`);
    return { success: true, data: newLesson };
  } catch (error) {
    console.error("Error duplicating lesson:", error);
    return { success: false, error: "Không thể sao chép bài học" };
  }
}

export async function updateLessonViews(lessonId: string) {
  try {
    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return { success: true, data: lesson };
  } catch (error) {
    console.error("Error updating lesson views:", error);
    return { success: false, error: "Không thể cập nhật lượt xem" };
  }
}

export async function bulkUpdateLessonStatus(
  lessonIds: string[],
  status: string
) {
  try {
    await db.lesson.updateMany({
      where: {
        id: {
          in: lessonIds,
        },
      },
      data: {
        status,
        updateAt: new Date(),
      },
    });

    revalidatePath(`/admin/course/content`);
    return { success: true };
  } catch (error) {
    console.error("Error bulk updating lesson status:", error);
    return { success: false, error: "Không thể cập nhật trạng thái bài học" };
  }
}
