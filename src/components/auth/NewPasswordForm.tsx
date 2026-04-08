"use client";

import { useTransition, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { newPassword, NewPasswordSchema } from "@/shared/actions/new-password";
import { toast } from "sonner";

export const NewPassWordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (data?.success) {
          setSuccess(data.success);
          form.reset();
          toast.success("Đặt lại mật khẩu thành công!", {
            description: "Mật khẩu đã được cập nhật.",
          });

          // Chuyển sang login sau 1 giây
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        }
      });
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="new-password">Mật khẩu mới</FieldLabel>
              <Input
                {...field}
                id="new-password"
                disabled={isPending}
                placeholder="******"
                type="password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Hiển thị thông báo lỗi/thành công từ API trả về */}
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm font-medium">{success}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white"
      >
        Đặt lại mật khẩu
      </Button>
    </form>
  );
};
