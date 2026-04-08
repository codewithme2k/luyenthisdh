"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { updateLesson } from "@/shared/actions/lesson.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lecture, Lesson } from "@/generated/prisma";
import { Save } from "lucide-react";

interface LessonItemUpdateProps {
  lessonId: string;
  lesson: Lesson;
  slug: string;
  course: {
    id: string;
    slug: string;
    lectures: Lecture[];
  };
}

export default function LessonItemUpdate({
  lessonId,
  lesson,
}: LessonItemUpdateProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: lesson.title,
    content: lesson.content || "",
    video: lesson.video || "",
    iframe: lesson.iframe || "",
    type: lesson.type,
    duration: lesson.duration,
    isFree: lesson.isFree,
    slug: lesson.slug,
  });

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const data = await updateLesson(lessonId, formData);
      if (data.success === true) {
        toast.success("Cập nhật bài học thành công");
        router.refresh();
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi lưu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Tiêu đề & Loại */}
        <div className="space-y-2">
          <Label htmlFor={`title-${lessonId}`}>Tiêu đề bài học</Label>
          <Input
            id={`title-${lessonId}`}
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Nhập tiêu đề bài học"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`type-${lessonId}`}>Loại bài học</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleInputChange("type", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id={`type-${lessonId}`}>
              <SelectValue placeholder="Chọn loại bài học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="text">Văn bản</SelectItem>
              <SelectItem value="quiz">Bài tập (Quiz)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video & Thời lượng */}
        <div className="space-y-2">
          <Label htmlFor={`video-${lessonId}`}>Video ID/URL</Label>
          <Input
            id={`video-${lessonId}`}
            value={formData.video}
            onChange={(e) => handleInputChange("video", e.target.value)}
            placeholder="Ví dụ: dQw4w9WgXcQ"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`duration-${lessonId}`}>Thời lượng (giây)</Label>
            <Input
              id={`duration-${lessonId}`}
              type="number"
              min="0"
              value={formData.duration}
              onChange={(e) =>
                handleInputChange(
                  "duration",
                  Number.parseInt(e.target.value) || 0,
                )
              }
              placeholder="0"
              disabled={isSubmitting}
            />
          </div>

          {/* Nút switch gộp vào chung hàng cho gọn */}
          <div className="space-y-2 flex flex-col justify-end">
            <Label htmlFor={`isFree-${lessonId}`} className="mb-2">
              Cho phép học thử
            </Label>
            <div className="flex items-center space-x-2 h-10">
              <Switch
                id={`isFree-${lessonId}`}
                checked={formData.isFree}
                onCheckedChange={(checked) =>
                  handleInputChange("isFree", checked)
                }
                disabled={isSubmitting}
              />
              <span className="text-sm text-muted-foreground">
                {formData.isFree ? "Miễn phí" : "Trang bị"}
              </span>
            </div>
          </div>
        </div>

        {/* Iframe chiếm full width nếu cần */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor={`iframe-${lessonId}`}>Iframe URL (Tùy chọn)</Label>
          <Input
            id={`iframe-${lessonId}`}
            value={formData.iframe}
            onChange={(e) => handleInputChange("iframe", e.target.value)}
            placeholder="Nhập đường dẫn Iframe tài liệu (nếu có)"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Nội dung Editor */}
      <div className="space-y-2">
        <Label htmlFor={`content-${lessonId}`}>Nội dung mô tả</Label>
        <Textarea
          id={`content-${lessonId}`}
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          placeholder="Mô tả nội dung chi tiết bài học..."
          rows={5}
          className="resize-y"
          disabled={isSubmitting}
        />
      </div>

      {/* Nút hành động */}
      <div className="flex justify-end gap-3 pt-4 border-t border-dashed">
        {/* Nút hủy này bạn có thể map với prop onCancelEdit nếu muốn */}
        <Button
          variant="outline"
          disabled={isSubmitting}
          onClick={() => {
            // Tùy chọn: Reset lại form nếu người dùng bấm Hủy
            setFormData({
              title: lesson.title,
              content: lesson.content || "",
              video: lesson.video || "",
              iframe: lesson.iframe || "",
              type: lesson.type,
              duration: lesson.duration,
              isFree: lesson.isFree,
              slug: lesson.slug,
            });
          }}
        >
          Khôi phục
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Đang lưu..." : "Lưu bài học"}
        </Button>
      </div>
    </div>
  );
}
