"use server";
import { db } from "@/lib/prisma";
import { currentUser } from "../hooks/auth";
import slugify from "slugify";

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
        title: title,
        courseId: courseId,
        order: order,
        createdAt: new Date(),
      },
    });
    await db.course.update({
      where: { id: courseId },
      data: {
        lectureId: {
          push: newLecture.id,
        },
      },
    });
    return {
      success: true,
      message: "Tạo Lecture thành công",
      lecture: newLecture, // 👈 thêm dòng này
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
}
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

    return { success: true, message: course };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, message: "Không thể tạo khóa học" };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    // Delete all lessons first
    await db.lesson.deleteMany({
      where: { courseId },
    });

    // Delete all lectures
    await db.lecture.deleteMany({
      where: { courseId },
    });

    // Delete the course
    await db.course.delete({
      where: { id: courseId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Không thể xóa khóa học" };
  }
}
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

    const newLectureIds: string[] = [];

    for (let i = 0; i < lectures.length; i++) {
      const lectureData = lectures[i];

      let lecture = await db.lecture.findFirst({
        where: {
          title: lectureData.title,
          courseId,
        },
      });

      if (lecture) {
        lecture = await db.lecture.update({
          where: { id: lecture.id },
          data: {
            order: i,
          },
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

      newLectureIds.push(lecture.id);

      for (let j = 0; j < lectureData.lessons.length; j++) {
        const lesson = lectureData.lessons[j];

        const createSlug = slugify(lesson.title, { lower: true, locale: "vi" });
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
              isFree: lesson.isFree ?? false, // ✅ THÊM DÒNG NÀY
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

    await db.course.update({
      where: { id: courseId },
      data: {
        lectureId: {
          set: newLectureIds,
        },
      },
    });

    return { success: true, message: "Đã ghi đè thành công nội dung khóa học" };
  } catch (error) {
    console.error("uploadCourseLectureLesson error:", error);
    return { success: false, message: "Không thể upload nội dung khóa học" };
  }
}

// export async function getCourseWithContent(courseId: string) {
//   try {
//     const course = await db.course.findUnique({
//       where: { id: courseId },
//       include: {
//         Lecture: {
//           include: {
//             lessons: {
//               orderBy: { order: "asc" },
//             },
//           },
//           orderBy: { order: "asc" },
//         },
//         Subject: true,
//         Author: true,
//       },
//     });

//     return { success: true, data: course };
//   } catch (error) {
//     console.error("Error getting course:", error);
//     return { success: false, error: "Không thể lấy thông tin khóa học" };
//   }
// }

// export async function updateCourseStats(courseId: string) {
//   try {
//     // Calculate total lessons and duration
//     const stats = await db.lesson.aggregate({
//       where: { courseId },
//       _count: { id: true },
//       _sum: { duration: true },
//     });

//     const course = await db.course.update({
//       where: { id: courseId },
//       data: {
//         // You can add custom fields for stats if needed
//         updatedAt: new Date(),
//       },
//     });

//     return {
//       success: true,
//       data: {
//         totalLessons: stats._count.id,
//         totalDuration: stats._sum.duration || 0,
//       },
//     };
//   } catch (error) {
//     console.error("Error updating course stats:", error);
//     return { success: false, error: "Không thể cập nhật thống kê khóa học" };
//   }
// }
// export async function updateCourse(
//   courseId: string,
//   data: {
//     name?: string;
//     slug?: string;
//     description?: string;
//     price?: number;
//     salePrice?: number;
//     status?: string;
//     level?: string;
//     label?: string;
//   }
// ) {
//   try {
//     const course = await db.course.update({
//       where: { id: courseId },
//       data,
//       include: {
//         Lecture: {
//           include: {
//             lessons: true,
//           },
//         },
//       },
//     });

//     return { success: true, data: course };
//   } catch (error) {
//     console.error("Error updating course:", error);
//     return { success: false, error: "Không thể cập nhật khóa học" };
//   }
// }
