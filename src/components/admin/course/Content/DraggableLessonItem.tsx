"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Đã xóa import Button vì không dùng đến nữa để tránh lỗi

import { LessonEditForm } from "./LessonEditForm";
import LessonItemUpdate from "./LessonItemUpdate";
import { Pen, Trash2, GripVertical, PlayCircle } from "lucide-react";
import { Lecture, Lesson } from "@/generated/prisma/client";

interface DraggableLessonItemProps {
  lesson: Lesson;
  courseId: string;
  courseSlug: string;
  lectureId: string;
  lectureList: Lecture[];
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
}

export function DraggableLessonItem({
  lesson,
  courseId,
  courseSlug,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lectureId,
  lectureList,
  isEditing,
  isSubmitting,
  onEdit,
  onCancelEdit,
  onDelete,
  onSubmitStart,
  onSubmitEnd,
}: DraggableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // --- TRẠNG THÁI ĐANG CHỈNH SỬA TÊN BÀI HỌC ---
  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-start gap-3 mb-4"
      >
        <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-lg border">
          <LessonEditForm
            lesson={lesson}
            courseId={courseId}
            courseSlug={courseSlug}
            isSubmitting={isSubmitting}
            onCancel={onCancelEdit}
            onSubmitStart={onSubmitStart}
            onSubmitEnd={onSubmitEnd}
          />
        </div>
        {/* Khóa nút Drag khi đang edit để tránh lỗi UX */}
        <div className="w-10 h-10 shrink-0 rounded-md flex items-center justify-center text-muted-foreground border bg-gray-50 dark:bg-gray-900 opacity-50 cursor-not-allowed">
          <GripVertical size={20} />
        </div>
      </div>
    );
  }

  // --- TRẠNG THÁI HIỂN THỊ BÌNH THƯỜNG ---
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "flex items-start gap-3 mb-3 transition-all",
        isDragging && "opacity-80 scale-[1.01] z-50 relative", // Hiệu ứng nhấc lên khi kéo
      )}
    >
      {/* Khung nội dung bài học */}
      <div
        className={cn(
          "flex-1 bg-white dark:bg-gray-950 border rounded-lg shadow-sm transition-colors overflow-hidden",
          isDragging && "border-primary shadow-md",
        )}
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={lesson.id} className="border-none">
            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg no-underline hover:no-underline">
              {/* Thêm gap-3 và overflow-hidden để chống rớt dòng */}
              <div className="flex items-center justify-between w-full gap-3 overflow-hidden">
                {/* Phần Tên Bài Học (Bên Trái) */}
                <div className="flex items-center gap-3 text-sm font-medium flex-1 overflow-hidden">
                  <PlayCircle size={18} className="text-primary shrink-0" />
                  <span className="truncate" title={lesson.title}>
                    {lesson.title}
                  </span>
                </div>

                {/* Phần Hành Động (Bên Phải) */}
                <div
                  className="flex items-center gap-1 shrink-0 ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Thay Button bằng div để sửa lỗi Hydration */}
                  <div
                    role="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      onEdit();
                    }}
                  >
                    <Pen size={15} />
                  </div>
                  <div
                    role="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete();
                    }}
                  >
                    <Trash2 size={15} />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
              <div className="pt-4 border-t border-dashed">
                <LessonItemUpdate
                  lessonId={lesson.id}
                  lesson={lesson}
                  slug={courseSlug}
                  course={{
                    id: courseId,
                    slug: courseSlug,
                    lectures: lectureList,
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Drag Handle (Nút Kéo Thả) */}
      <button
        {...listeners}
        className={cn(
          "w-10 h-10 shrink-0 rounded-md flex items-center justify-center text-muted-foreground border transition-colors cursor-grab active:cursor-grabbing",
          isDragging
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900",
        )}
        aria-label="Kéo thả để sắp xếp"
      >
        <GripVertical size={20} />
      </button>
    </div>
  );
}
