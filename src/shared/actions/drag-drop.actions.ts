"use server";

import { db } from "@/lib/prisma";

type lectureList = {
  id: string;
  Lessons: { id: string; order: number }[];
}[];

export async function updateLessonOrder(lectures: lectureList) {
  try {
    // Update lesson orders in a transaction
    const updates = [];

    for (const lecture of lectures) {
      for (let i = 0; i < lecture.Lessons.length; i++) {
        const lesson = lecture.Lessons[i];
        updates.push(
          db.lesson.update({
            where: { id: lesson.id },
            data: {
              order: lesson.order,
              updateAt: new Date(),
            },
          }),
        );
      }
    }

    await db.$transaction(updates);
    return { success: true, message: "Thành công" };
  } catch (error) {
    console.error("Error updating lesson order:", error);
    return { success: false, message: "Không thể cập nhật thứ tự bài học" };
  }
}

export async function updateLectureLessonOrder(Lectures: lectureList) {
  try {
    // Update both lecture and lesson orders in a transaction
    const updates = [];

    for (const lecture of Lectures) {
      // Update lessons in this lecture
      for (let i = 0; i < lecture.Lessons.length; i++) {
        const lesson = lecture.Lessons[i];
        updates.push(
          db.lesson.update({
            where: { id: lesson.id },
            data: {
              lectureId: lecture.id,
              order: lesson.order,
              updateAt: new Date(),
            },
          }),
        );
      }
    }

    await db.$transaction(updates);
    return { success: true, message: "Thành công" };
  } catch (error) {
    console.error("Error updating lecture lesson order:", error);
    return {
      success: false,
      message: "Không thể cập nhật thứ tự chương và bài học",
    };
  }
}

export async function moveLessonBetweenLectures(
  lessonId: string,
  sourceLectureId: string,
  targetLectureId: string,
  newOrder: number,
) {
  try {
    // Get target lecture to get courseId
    const targetLecture = await db.lecture.findUnique({
      where: { id: targetLectureId },
      select: { courseId: true },
    });

    if (!targetLecture) {
      return { success: false, message: "Không tìm thấy chương đích" };
    }

    await db.$transaction(async (tx) => {
      // Move the lesson to new lecture
      await tx.lesson.update({
        where: { id: lessonId },
        data: {
          lectureId: targetLectureId,
          courseId: targetLecture.courseId,
          order: newOrder,
          updateAt: new Date(),
        },
      });

      // Reorder remaining lessons in source lecture
      const sourceLessons = await tx.lesson.findMany({
        where: { lectureId: sourceLectureId },
        orderBy: { order: "asc" },
      });

      for (let i = 0; i < sourceLessons.length; i++) {
        await tx.lesson.update({
          where: { id: sourceLessons[i].id },
          data: { order: i + 1 },
        });
      }

      // Reorder lessons in target lecture
      const targetLessons = await tx.lesson.findMany({
        where: { lectureId: targetLectureId },
        orderBy: { order: "asc" },
      });

      for (let i = 0; i < targetLessons.length; i++) {
        await tx.lesson.update({
          where: { id: targetLessons[i].id },
          data: { order: i + 1 },
        });
      }
    });

    return { success: true, message: "Thành công" };
  } catch (error) {
    console.error("Error moving lesson between lectures:", error);
    return { success: false, message: "Không thể di chuyển bài học" };
  }
}
