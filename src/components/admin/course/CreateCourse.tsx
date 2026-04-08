"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ComboBox } from "@/components/customs/Combobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(3, { message: "Tên phải ít nhất 3 ký tự" }).max(60),
  slug: z.string().optional(),
  subjectId: z.string().min(1, {
    message: "Môn học bắt buộc nhập",
  }),
});

export default function CreateCourse({
  subjects,
}: {
  subjects: { value: string; label: string }[];
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      subjectId: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        name: values.name,
        subjectId: values.subjectId,
        slug: slugify(values.slug || values.name, {
          lower: true,
          locale: "vi",
        }),
      };

      const res = await fetch("/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Tạo khoá học thất bại");
      }

      const data = await res.json();

      toast.success("Tạo khoá học thành công", {
        description: `Tên: ${data.name}`,
      });

      form.reset();
      router.push(`/admin/course/edit/${data.slug}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Lỗi tạo khoá học", {
          description: error.message,
        });
      } else {
        toast.error("Lỗi không xác định", {
          description: "Đã xảy ra lỗi không mong muốn.",
        });
      }
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Tạo Khóa Học Mới</CardTitle>
          <CardDescription>
            Điền thông tin cơ bản để tạo một khóa học (hoặc bài thi) mới.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="create-course-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Chọn Môn Học (Nằm một hàng riêng) */}
              <Controller
                control={form.control}
                name="subjectId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="course-subject">
                      Chọn Môn học <span className="text-red-500">*</span>
                    </FieldLabel>
                    <ComboBox options={subjects} {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Tên và Slug (Chia 2 cột trên màn hình md trở lên) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="course-name">
                        Tên Khóa Học / Bài Thi{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="course-name"
                        placeholder="VD: Lập trình Next.js"
                        type="text"
                        disabled={isLoading}
                        aria-invalid={fieldState.invalid}
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
                      <FieldLabel htmlFor="course-slug">
                        Slug (tuỳ chọn)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="course-slug"
                        placeholder="VD: lap-trinh-nextjs"
                        type="text"
                        disabled={isLoading}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" form="create-course-form" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo Khóa Học"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
