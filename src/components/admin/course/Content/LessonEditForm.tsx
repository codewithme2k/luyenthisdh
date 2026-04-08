"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  baseButtonClassName,
  primaryButtonClassName,
} from "@/shared/constants";

import { toast } from "sonner";
import { updateLesson } from "@/shared/actions/lesson.actions";
import type { Lesson } from "@/generated/prisma/client";
import { convertSlug } from "@/lib/commons";

interface LessonEditFormProps {
  lesson: Lesson;
  courseId: string;
  courseSlug: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
}

export function LessonEditForm({
  lesson,
  isSubmitting,
  onCancel,
  onSubmitStart,
  onSubmitEnd,
}: LessonEditFormProps) {
  const [lessonData, setLessonData] = useState({
    title: lesson.title,
    video: lesson.video,
    iframe: lesson.iframe ?? "",
    isFree: lesson.isFree,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: keyof typeof lessonData, value: any) => {
    setLessonData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    onSubmitStart();

    try {
      await updateLesson(lesson.id, {
        title: lessonData.title,
        slug: convertSlug(lessonData.title),
        iframe: lessonData.iframe || undefined,
        video: lessonData.video,
        isFree: lessonData.isFree,
      });

      toast.success("Bài học đã được cập nhật thành công");
      onCancel();
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại");
    } finally {
      onSubmitEnd();
    }
  };

  return (
    <div className="p-5 rounded-lg border bg-background dark:border-primary my-5">
      <div className="flex items-baseline gap-3 mb-5">
        <h3 className="flex-shrink-0 font-bold">Tên bài học:</h3>

        <div className="flex flex-col gap-2 w-full">
          <Input
            placeholder="Nhập tiêu đề"
            className="font-medium"
            value={lessonData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <Input
            placeholder="Nhập playbackID"
            className="font-semibold font-sans"
            value={lessonData.video}
            onChange={(e) => handleChange("video", e.target.value)}
          />

          <Input
            placeholder="Nhập iframe"
            className="font-semibold font-sans !text-blue-500"
            value={lessonData.iframe}
            onChange={(e) => handleChange("iframe", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          className={primaryButtonClassName}
          onClick={handleSave}
          disabled={isSubmitting}
        >
          Cập nhật
        </Button>

        <button
          className={cn(baseButtonClassName, "bg-destructive")}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
