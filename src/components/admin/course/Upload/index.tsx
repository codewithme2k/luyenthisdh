"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

import { FileText, UploadCloud } from "lucide-react";
import { uploadCourseLectureLesson } from "@/shared/actions/course.action";
import { Course } from "@/generated/prisma";

export default function UploadLecture({
  course,
  userId,
}: {
  course: Course;
  userId: string;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.name.endsWith(".txt")) {
      setFile(selectedFile);
    } else {
      setFile(null);
      toast.error("Chỉ hỗ trợ file .txt");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file .txt");
      return;
    }

    setLoading(true);

    try {
      const text = await file.text();

      // 🧠 Parse nội dung text file
      const lectures = JSON.parse(text); // phải là UploadLectureData[]
      const res = await uploadCourseLectureLesson(course.id, userId, lectures);
      if (!res.success) {
        toast.error("Import thất bại", {
          description: res.message || "Lỗi không xác định",
        });
      } else {
        toast.success("Đã Import thành công");
        router.push(`/admin/course/${course.slug}/content`);
      }
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Không rõ nguyên nhân";
      toast.error("Đã xảy ra lỗi", { description: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10 p-6 space-y-6 shadow-xl rounded-2xl border">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          {course.name}
        </h2>
        {course.description && (
          <p className="text-muted-foreground">📋 {course.description}</p>
        )}
        <div className="text-sm text-gray-600 grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
          <span>
            🧪 Loại: <b>{course.level}</b>
          </span>
          <span>
            📊 Giá: <b>{course.salePrice}</b>
          </span>
          <span>
            ❤️ View: <b>{course.views}</b>
          </span>
        </div>
      </div>

      <CardContent className="flex flex-col gap-4 px-0 pb-0">
        <div className="space-y-2">
          <Label className="text-destructive font-semibold" htmlFor="file">
            Chọn file câu hỏi (.txt)
          </Label>
          <Input
            id="file"
            type="file"
            accept=".txt"
            onChange={handleFileChange}
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          className="flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          {loading ? "Đang tải..." : "Tải lên & Import"}
        </Button>
      </CardContent>
    </Card>
  );
}
