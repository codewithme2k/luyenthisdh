"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import slugify from "slugify";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CirclePlus, CircleX, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboBox } from "@/components/customs/Combobox";
import { UploadDropzone } from "@/lib/uploadthing";

import { cn } from "@/lib/utils";
import { type Course } from "@/generated/prisma/client";
export const ECourseLevel = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
} as const;

export const ECourseStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const;
const actionClassName =
  "size-8 flex items-center justify-center bg-primary dark:bg-primary rounded  p-2 transition-all  hover:text-gray-500 dark:hover:text-opacity-80";
export default function EditCourseForm({
  data,
  subjects,
}: {
  data: Course; // Course model có chứa field `info` dạng JSON
  subjects: { value: string; label: string }[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateCourseSchema = z.object({
    name: z.string().min(10, {
      message: "Tiêu đề phải có ít nhất 10 ký tự",
    }),
    slug: z.string().optional(),
    subjectId: z.string().min(1, {
      message: "Môn học là bắt buộc",
    }),
    cta: z.string().optional(),
    price: z.string().optional(),
    salePrice: z.string().optional(),
    intro: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    level: z
      .enum([
        ECourseLevel.BEGINNER,
        ECourseLevel.ADVANCED,
        ECourseLevel.INTERMEDIATE,
      ])
      .optional(),
    status: z.enum([ECourseStatus.DRAFT, ECourseStatus.PUBLISHED]).optional(),
    seoKeywords: z.string().optional(),
    free: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof updateCourseSchema>>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      name: data.name || "",
      slug: data.slug || "",
      subjectId: data.subjectId || "",
      price: data.price?.toString() || "",
      salePrice: data.salePrice?.toString() || "",
      intro: data.intro || "",
      description: data.description || "",
      level: data.level,
      image: data.image || "",
      status: data.status,
      cta: data.cta || "",
      seoKeywords: data.seoKeywords || "",
      free: data.free || false,
    },
  });

  const image = useWatch({
    control: form.control,
    name: "image",
  });

  // Thay thế useImmer bằng useState thuần
  const [infoData, setInfoData] = useState({
    requirements: (data.info?.requirements as string[]) || [],

    qa: (data.info?.qa as { question: string; answer: string }[]) || [],

    gained: (data.info?.gained as string[]) || [],
  });

  // Các hàm xử lý State cho Mảng động (Không dùng useImmer)
  const handleAddInfo = (type: keyof typeof infoData) => {
    setInfoData((prev) => ({
      ...prev,
      [type]:
        type === "qa"
          ? [...prev.qa, { question: "", answer: "" }]
          : [...(prev[type] as string[]), ""],
    }));
  };

  const handleRemoveInfo = (type: keyof typeof infoData, index: number) => {
    setInfoData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleUpdateStringArray = (
    type: "requirements" | "gained",
    index: number,
    value: string,
  ) => {
    setInfoData((prev) => {
      const newArray = [...prev[type]];
      newArray[index] = value;
      return { ...prev, [type]: newArray };
    });
  };

  const handleUpdateQA = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    setInfoData((prev) => {
      const newQA = [...prev.qa];
      newQA[index] = { ...newQA[index], [field]: value };
      return { ...prev, qa: newQA };
    });
  };

  async function onSubmit(values: z.infer<typeof updateCourseSchema>) {
    setIsSubmitting(true);
    try {
      const payload = {
        slug: slugify(values.slug || values.name, {
          lower: true,
          locale: "vi",
        }),
        ...values,
        info: {
          requirements: infoData.requirements.filter(
            (item) => item.trim() !== "",
          ),
          gained: infoData.gained.filter((item) => item.trim() !== ""),
          qa: infoData.qa.filter(
            (item) => item.question.trim() !== "" || item.answer.trim() !== "",
          ),
        },
      };

      const res = await fetch("/api/course", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Cập nhật thất bại");
      }

      const updatedData = await res.json();

      toast.success("Cập nhật thành công", {
        description: `Tên: ${updatedData.name}`,
      });

      router.push(`/admin/course/edit/${updatedData.slug}`);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Lỗi cập nhật", { description: error.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-6">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-6"
      >
        {/* CARD 1: THÔNG TIN CƠ BẢN */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Tên khóa học <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      placeholder="Tên khóa học"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="slug"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Đường dẫn (Slug)</FieldLabel>
                    <Input
                      placeholder="tu-dong-tao-neu-de-trong"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="subjectId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Danh mục / Môn học <span className="text-red-500">*</span>
                    </FieldLabel>
                    <ComboBox options={subjects} {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="level"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Trình độ</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trình độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Dễ (Beginner)</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Trung bình (Intermediate)
                        </SelectItem>
                        <SelectItem value="ADVANCED">Khó (Advanced)</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Trạng thái</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLISHED">
                          Đã xuất bản (Published)
                        </SelectItem>
                        <SelectItem value="DRAFT">Bản nháp (Draft)</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* CARD 2: GIÁ BÁN & CTA */}
        <Card>
          <CardHeader>
            <CardTitle>Giá bán & Hành động</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Giá gốc (VNĐ)</FieldLabel>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 1000000"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="salePrice"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Giá khuyến mãi (VNĐ)</FieldLabel>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 800000"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="cta"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Call to Action (Nút bấm)</FieldLabel>
                    <Input
                      placeholder="Ví dụ: Đăng ký ngay"
                      {...field}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* CARD 3: MEDIA, SEO & MÔ TẢ */}
        <Card>
          <CardHeader>
            <CardTitle>Truyền thông & SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Controller
                  control={form.control}
                  name="intro"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Video giới thiệu (Intro URL)</FieldLabel>
                      <Input
                        placeholder="Link Youtube Video"
                        {...field}
                        disabled={isSubmitting}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="seoKeywords"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Từ khóa SEO</FieldLabel>
                      <Input
                        placeholder="khoa hoc react, hoc nextjs..."
                        {...field}
                        disabled={isSubmitting}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Mô tả ngắn</FieldLabel>
                      <Textarea
                        placeholder="Viết mô tả..."
                        className="h-[145px]"
                        {...field}
                        disabled={isSubmitting}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div>
                <FieldLabel className="mb-2 block">
                  Ảnh đại diện (Thumbnail)
                </FieldLabel>
                {image ? (
                  <div className="relative group w-full h-[250px]">
                    <Image
                      src={image}
                      alt="Thumbnail"
                      fill
                      className="rounded-lg object-cover border"
                    />
                    <button
                      type="button"
                      className={cn(
                        actionClassName,
                        " text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:bg-red-500 hover:text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all",
                      )}
                      onClick={() => form.setValue("image", "")}
                    >
                      <CircleX />
                    </button>
                  </div>
                ) : (
                  <UploadDropzone
                    className="justify-center items-center bg-gray-50 dark:bg-gray-900 border-dashed rounded-lg h-[250px] cursor-pointer"
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      form.setValue("image", res[0].ufsUrl);
                    }}
                    onUploadError={(error: Error) =>
                      alert(`ERROR! ${error.message}`)
                    }
                  />
                )}
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* CARD 4: THÔNG TIN BỔ SUNG (INFO JSON) */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chi tiết khóa học</CardTitle>
            <CardDescription>
              Các mục Yêu cầu, Lợi ích và Hỏi đáp sẽ được lưu dưới dạng danh
              sách.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Lợi ích */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FieldLabel className="mb-0">
                  Kết quả đạt được (Gained)
                </FieldLabel>
                <button
                  type="button"
                  onClick={() => handleAddInfo("gained")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <CirclePlus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {infoData.gained.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Lợi ích số ${index + 1}`}
                      value={item}
                      onChange={(e) =>
                        handleUpdateStringArray("gained", index, e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveInfo("gained", index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {infoData.gained.length === 0 && (
                  <p className="text-sm text-gray-400 italic">
                    Chưa có dữ liệu.
                  </p>
                )}
              </div>
            </div>

            {/* Yêu cầu */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FieldLabel className="mb-0">
                  Yêu cầu đầu vào (Requirements)
                </FieldLabel>
                <button
                  type="button"
                  onClick={() => handleAddInfo("requirements")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <CirclePlus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {infoData.requirements.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Yêu cầu số ${index + 1}`}
                      value={item}
                      onChange={(e) =>
                        handleUpdateStringArray(
                          "requirements",
                          index,
                          e.target.value,
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveInfo("requirements", index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {infoData.requirements.length === 0 && (
                  <p className="text-sm text-gray-400 italic">
                    Chưa có dữ liệu.
                  </p>
                )}
              </div>
            </div>

            {/* Q&A */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FieldLabel className="mb-0">
                  Hỏi đáp thường gặp (Q&A)
                </FieldLabel>
                <button
                  type="button"
                  onClick={() => handleAddInfo("qa")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <CirclePlus size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {infoData.qa.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-start bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                      <Input
                        placeholder="Nhập câu hỏi..."
                        value={item.question}
                        onChange={(e) =>
                          handleUpdateQA(index, "question", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Nhập câu trả lời..."
                        value={item.answer}
                        onChange={(e) =>
                          handleUpdateQA(index, "answer", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveInfo("qa", index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                {infoData.qa.length === 0 && (
                  <p className="text-sm text-gray-400 italic">
                    Chưa có dữ liệu Hỏi đáp.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NÚT LƯU */}
        <div className="sticky bottom-4 z-10 flex justify-end gap-4 bg-background/80 backdrop-blur-md p-4 rounded-lg border shadow-sm">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
