"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import slugify from "slugify";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên phải ít nhất 2 ký tự" }).max(60),
  slug: z.string().optional(),
  image: z.string().optional(),
});

export default function EditSubject({
  data,
  slug,
}: {
  data: { name: string; slug: string; id: string; image: string };
  slug: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      slug: data.slug,
      image: data.image,
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        id: data.id,
        name: values.name,
        image: values.image ?? "",
        slug:
          values.slug && values.slug !== slug
            ? slugify(values.slug, { lower: true, locale: "vi" })
            : slugify(values.name, { lower: true, locale: "vi" }),
      };

      const res = await fetch("/api/subject", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Cập nhật môn học thất bại");
      }

      const updatedSubject = await res.json();

      toast.success("Cập nhật môn học thành công", {
        description: `Tên: ${updatedSubject.name}`,
      });

      form.reset();
      router.replace(`/admin/subject`);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Lỗi cập nhật môn học", {
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 container mx-auto p-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: Input Tên và Slug */}
        <div className="col-span-2">
          <FieldGroup>
            {/* Tên môn học */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-name">Tên Môn học</FieldLabel>
                  <Input
                    {...field}
                    id="edit-name"
                    placeholder="VD: Công nghệ"
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

            {/* Slug */}
            <Controller
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-slug">Slug (tuỳ chọn)</FieldLabel>
                  <Input
                    {...field}
                    id="edit-slug"
                    placeholder="VD: cong-nghe"
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
          </FieldGroup>
        </div>

        {/* Cột phải: Upload Ảnh */}
        <div className="col-span-1 flex items-start md:justify-center">
          <Controller
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="image-upload">Ảnh minh họa</FieldLabel>
                <div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          field.onChange(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-block mt-2"
                  >
                    {field.value ? (
                      <Image
                        src={field.value}
                        alt="Ảnh minh họa"
                        width={100}
                        height={100}
                        className="object-cover rounded border w-40 h-40"
                      />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center border border-dashed rounded text-gray-400 hover:bg-gray-50 transition-colors">
                        Click để chọn ảnh
                      </div>
                    )}
                  </label>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Đang cập nhật..." : "Cập nhật môn học"}
      </Button>
    </form>
  );
}
