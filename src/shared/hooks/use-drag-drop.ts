"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Lesson } from "@/generated/prisma/client";
import {
  updateLectureLessonOrder,
  updateLessonOrder,
} from "@/shared/actions/drag-drop.actions";
import { lectureList } from "@/shared/types";

export function useDragDrop(lectureList: lectureList) {
  const router = useRouter();

  const findLessonLocation = (lessonId: string) => {
    for (let lecIdx = 0; lecIdx < lectureList.length; lecIdx++) {
      const lec = lectureList[lecIdx];
      if (!lec) continue;
      const lesIdx = lec.Lessons.findIndex(
        (lesson: Lesson) => lesson.id === lessonId,
      );
      if (lesIdx !== -1) return { lecIdx, lesIdx };
    }
    return { lecIdx: -1, lesIdx: -1 };
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const { lecIdx: sourceLecIdx, lesIdx: sourceLesIdx } =
      findLessonLocation(activeId);
    if (sourceLecIdx === -1) return;

    let { lecIdx: destLecIdx, lesIdx: destLesIdx } = findLessonLocation(overId);

    if (destLecIdx === -1) {
      destLecIdx = lectureList.findIndex((lec) => lec.id === overId);
      if (destLecIdx !== -1) {
        const destLec = lectureList[destLecIdx];
        destLesIdx = destLec && destLec.Lessons ? destLec.Lessons.length : 0;
      } else {
        return;
      }
    }

    try {
      const sourceLecture = lectureList[sourceLecIdx];
      const destLecture = lectureList[destLecIdx];

      if (!sourceLecture || !destLecture) return;

      if (sourceLecIdx === destLecIdx) {
        if (sourceLesIdx === destLesIdx) return;

        // FIX LỖI Ở ĐÂY: Thêm ( ... as Lesson[]) để ép kiểu
        const reorderedLessons = (
          arrayMove(sourceLecture.Lessons, sourceLesIdx, destLesIdx) as Lesson[]
        ).map((lesson, index) => ({
          ...lesson,
          order: index,
        }));

        const updatedLecture = { ...sourceLecture, Lessons: reorderedLessons };

        const result = await updateLessonOrder([updatedLecture]);
        if (result.success) {
          toast.success("Đã cập nhật thứ tự bài học");
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } else {
        const movedLesson = sourceLecture.Lessons[sourceLesIdx];
        if (!movedLesson) return;

        const newSourceLessons = [...sourceLecture.Lessons];
        newSourceLessons.splice(sourceLesIdx, 1);

        const newDestLessons = [...destLecture.Lessons];
        newDestLessons.splice(destLesIdx, 0, movedLesson);

        const newLectures = lectureList.map((lec, index) => {
          if (index === sourceLecIdx) {
            return {
              ...lec,
              Lessons: newSourceLessons.map((lesson: Lesson, i: number) => ({
                ...lesson,
                order: i,
              })),
            };
          }
          if (index === destLecIdx) {
            return {
              ...lec,
              Lessons: newDestLessons.map((lesson: Lesson, i: number) => ({
                ...lesson,
                order: i,
                lectureId: destLecture.id,
              })),
            };
          }
          return lec;
        });

        await updateLectureLessonOrder(newLectures);
        toast.success("Đã di chuyển bài học sang chương mới");
        router.refresh();
      }
    } catch (error) {
      console.error("Drag and drop error:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật hệ thống");
    }
  };

  return { handleDragEnd };
}
