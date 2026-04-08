"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

import { DraggableLessonItem } from "./DraggableLessonItem";
import { Lecture, Lesson } from "@/generated/prisma/client";

interface SortableLessonsContainerProps {
  lectureId: string;
  Lessons: Lesson[];
  courseId: string;
  courseSlug: string;
  lectureList: Lecture[];
  editingLessonId: string;
  isSubmitting: boolean;
  onEditLesson: (lessonId: string) => void;
  onCancelEditLesson: () => void;
  onDeleteLesson: (lessonId: string, lectureId: string) => void;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
}

export function SortableLessonsContainer({
  lectureId,
  Lessons,
  courseId,
  courseSlug,
  lectureList,
  editingLessonId,
  isSubmitting,
  onEditLesson,
  onCancelEditLesson,
  onDeleteLesson,
  onSubmitStart,
  onSubmitEnd,
}: SortableLessonsContainerProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: lectureId,
  });

  return (
    <SortableContext
      items={Lessons.map((lesson) => lesson.id)}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col mb-5 min-h-25 pb-20 rounded-lg p-5",
          isOver && "border border-primary shadow-main",
        )}
      >
        {Lessons.map((lesson) => (
          <DraggableLessonItem
            key={lesson.id}
            lesson={lesson}
            courseId={courseId}
            courseSlug={courseSlug}
            lectureId={lectureId}
            lectureList={lectureList}
            isEditing={editingLessonId === lesson.id}
            isSubmitting={isSubmitting}
            onEdit={() => onEditLesson(lesson.id)}
            onCancelEdit={onCancelEditLesson}
            onDelete={() => onDeleteLesson(lesson.id, lectureId)}
            onSubmitStart={onSubmitStart}
            onSubmitEnd={onSubmitEnd}
          />
        ))}
      </div>
    </SortableContext>
  );
}
