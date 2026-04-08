"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "../hooks/auth";
import slugify from "slugify";

// ================= CHANGE STATUS =================
export async function changeCourseStatus(
  id: string,
  status: "DRAFT" | "PUBLISHED",
) {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const course = await db.course.findUnique({ where: { id } });

    if (!course) {
      return {
        success: false,
        message: "Không tìm thấy khóa học",
      };
    }

    await db.course.update({
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

// ================= CREATE LECTURE =================
export async function updateCourseWithLecture(
  title: string,
  courseId: string,
  order: number,
) {
  const user = await currentUser();
  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const course = await db.course.findUnique({ where: { id: courseId } });

    if (!course) {
      return {
        success: false,
        message: "Không tìm thấy khóa học",
      };
    }

    const newLecture = await db.lecture.create({
      data: {
        title,
        courseId, // ✅ relation chuẩn
        order,
        createdAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Tạo Lecture thành công",
      lecture: newLecture,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Có lỗi xảy ra",
    };
  }
}

// ================= CREATE COURSE =================
export async function createCourse(data: {
  name: string;
  slug: string;
  description?: string;
  price?: number;
  salePrice?: number;
  subjectId: string;
  authorId: string;
}) {
  try {
    const course = await db.course.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price || 0,
        salePrice: data.salePrice || 0,
        subjectId: data.subjectId,
        authorId: data.authorId,
      },
      include: {
        Lectures: {
          include: {
            Lessons: true,
          },
        },
      },
    });

    return { success: true, data: course };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, message: "Không thể tạo khóa học" };
  }
}

// ================= DELETE COURSE =================
export async function deleteCourse(courseId: string) {
  try {
    // Xóa lesson trước
    await db.lesson.deleteMany({
      where: { courseId },
    });

    // Xóa lecture
    await db.lecture.deleteMany({
      where: { courseId },
    });

    // Xóa course
    await db.course.delete({
      where: { id: courseId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Không thể xóa khóa học" };
  }
}

// ================= TYPES =================
interface UploadLectureData {
  title: string;
  lessons: {
    title: string;
    type: string;
    video?: string;
    iframe?: string;
    isFree?: boolean;
  }[];
}

// ================= UPSERT COURSE CONTENT =================
export async function uploadCourseLectureLesson(
  courseId: string,
  userId: string,
  lectures: UploadLectureData[],
) {
  const user = await currentUser();

  if (!user || (user.id !== userId && user.role !== "ADMIN")) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const course = await db.course.findUnique({ where: { id: courseId } });

    if (!course) {
      return { success: false, message: "Không tìm thấy khóa học" };
    }

    for (let i = 0; i < lectures.length; i++) {
      const lectureData = lectures[i];

      // ===== UPSERT LECTURE =====
      let lecture = await db.lecture.findFirst({
        where: {
          title: lectureData.title,
          courseId,
        },
      });

      if (lecture) {
        lecture = await db.lecture.update({
          where: { id: lecture.id },
          data: { order: i },
        });
      } else {
        lecture = await db.lecture.create({
          data: {
            title: lectureData.title,
            order: i,
            courseId,
            createdAt: new Date(),
          },
        });
      }

      // ===== UPSERT LESSON =====
      for (let j = 0; j < lectureData.lessons.length; j++) {
        const lesson = lectureData.lessons[j];

        const createSlug = slugify(lesson.title, {
          lower: true,
          locale: "vi",
        });

        const slug = `${createSlug}-${Math.random().toString(36).slice(-4)}`;

        const existingLesson = await db.lesson.findFirst({
          where: {
            title: lesson.title,
            lectureId: lecture.id,
          },
        });

        if (existingLesson) {
          await db.lesson.update({
            where: { id: existingLesson.id },
            data: {
              slug,
              order: j,
              type: lesson.type,
              video: lesson.video || "",
              iframe: lesson.iframe || "",
              isFree: lesson.isFree ?? false,
            },
          });
        } else {
          await db.lesson.create({
            data: {
              title: lesson.title,
              slug,
              order: j,
              type: lesson.type,
              video: lesson.video || "",
              iframe: lesson.iframe || "",
              isFree: lesson.isFree ?? false,
              duration: 0,
              content: "",
              status: "draft",
              courseId,
              lectureId: lecture.id,
            },
          });
        }
      }
    }

    return {
      success: true,
      message: "Đã cập nhật nội dung khóa học",
    };
  } catch (error) {
    console.error("uploadCourseLectureLesson error:", error);
    return {
      success: false,
      message: "Không thể upload nội dung khóa học",
    };
  }
}
