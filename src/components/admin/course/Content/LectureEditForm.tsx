"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateLecture } from "@/shared/actions/lecture.actions";
import type { Lecture } from "@/generated/prisma/client";

interface LectureEditFormProps {
  lecture: Lecture;
  courseSlug: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
}

export function LectureEditForm({
  lecture,
  isSubmitting,
  onCancel,
  onSubmitStart,
  onSubmitEnd,
}: LectureEditFormProps) {
  const [lectureInput, setLectureInput] = useState(lecture.title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Tự động focus vào ô input khi form được mở lên
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Ngăn chặn reload trang khi nhấn Enter

    const trimmedInput = lectureInput.trim();

    // Validate: Không cho phép lưu nếu tên chương rỗng
    if (!trimmedInput) {
      toast.error("Tên chương không được để trống!");
      return;
    }

    // Không gọi API nếu không có sự thay đổi
    if (trimmedInput === lecture.title) {
      onCancel();
      return;
    }

    onSubmitStart();
    try {
      await updateLecture(lecture.id, {
        title: trimmedInput,
      });
      toast.success("Cập nhật tên chương thành công!");
      onCancel(); // Đóng form sau khi thành công
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      onSubmitEnd();
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="p-5 rounded-lg border bg-gray-50 dark:bg-gray-900/50 shadow-sm space-y-4"
    >
      <div className="space-y-2">
        <label
          htmlFor={`edit-lecture-${lecture.id}`}
          className="text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Tên chương:
        </label>
        <Input
          id={`edit-lecture-${lecture.id}`}
          ref={inputRef}
          placeholder="Nhập tên chương..."
          className="font-medium bg-white dark:bg-gray-950"
          value={lectureInput}
          onChange={(e) => setLectureInput(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !lectureInput.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? "Đang lưu..." : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}
