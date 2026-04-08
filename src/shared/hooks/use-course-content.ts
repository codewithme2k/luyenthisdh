"use client";

import { useState, useEffect } from "react";
import { useImmer } from "use-immer";

import Swal from "sweetalert2";

import { toast } from "sonner";
import { updateCourseWithLecture } from "../actions/course.action";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { Course, Lecture, Lesson } from "@/generated/prisma/client";
import { deleteLecture } from "@/shared/actions/lecture.actions";
import { createLesson, deleteLesson } from "@/shared/actions/lesson.actions";

type LectureWithLessons = Lecture & {
  Lessons: Lesson[];
};
export function useCourseContent(
  courseData: Course & { Lectures: (Lecture & { Lessons: Lesson[] })[] },
) {
  const router = useRouter();
  const [lectureList, setLectureList] = useState<LectureWithLessons[]>([]);

  const [editStates, setEditStates] = useState({
    lectureId: "",
    lessonId: "",
  });

  const [isSubmitting, setIsSubmitting] = useImmer({
    lecture: false,
    lesson: false,
  });

  useEffect(() => {
    if (Array.isArray(courseData?.Lectures)) {
      setLectureList(
        courseData.Lectures.map((item: Lecture & { Lessons: Lesson[] }) => ({
          id: item.id,
          title: item.title,
          order: item.order,
          courseId: item.courseId,
          createdAt: item.createdAt,
          updateAt: item.updateAt,
          Lessons: item.Lessons,
        })),
      );
    } else {
      setLectureList([]); // hoặc giữ nguyên trạng thái nếu bạn muốn
    }
  }, [courseData]);

  const handleAddLecture = async () => {
    setIsSubmitting((draft) => {
      draft.lecture = true;
    });
    try {
      const req = await updateCourseWithLecture(
        "Tiêu đề chương mới",
        courseData.id.toString(),
        lectureList.length,
      );
      if (req.success === true) {
        toast.success("Thêm mới thành công");
        router.refresh();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm chương mới");
      console.log(error);
    } finally {
      setIsSubmitting((draft) => {
        draft.lecture = false;
      });
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc muốn xóa chương này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        const data = await deleteLecture(lectureId, courseData.id.toString());
        if (data.success === true) {
          toast.success("Xoá thành công");
          router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddLesson = async (lectureId: string) => {
    try {
      const data = await createLesson({
        title: "Tiêu đề bài học mới",
        slug: slugify("tiêu đề bài học mới", {
          lower: true,
          locale: "vi",
        }),
        content: "",
        video: "",
        type: "video",
        order:
          lectureList.find((item) => item.id === lectureId)?.Lessons.length ||
          0,
        lectureId,
        courseId: courseData.id.toString(),
      });
      if (data.success === true) {
        toast.success("Thêm bài học mới thành công");
        router.refresh();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm bài học");
      console.log(error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận xóa",
        text: "Bạn có chắc muốn xóa bài học này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      let data;
      if (result.isConfirmed) {
        data = await deleteLesson(lessonId);
        if (data.success === true) {
          toast.success("Xoá thành công");
          router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    lectureList,
    editStates,
    setEditStates,
    isSubmitting,
    setIsSubmitting,
    handleAddLecture,
    handleDeleteLecture,
    handleAddLesson,
    handleDeleteLesson,
  };
}
