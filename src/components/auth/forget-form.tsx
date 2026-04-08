"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { reset } from "@/shared/actions/reset.action";
import { toast } from "sonner";
import { ResetSchema } from "@/shared/schemas/auth.schema";

export const ResetForm = () => {
  const router = useRouter(); // ✅ Sử dụng router
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset: resetForm,
  } = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      reset(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        if (data?.success) {
          setSuccess(data.success);
          resetForm();
          toast.success("Đặt lại mật khẩu thành công!", {
            description: `Vui lòng kiểm tra email`,
          });

          // ✅ Chuyển sang login sau 2 giây
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("email")}
        type="email"
        placeholder="Your email"
        disabled={isPending}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white hover:text-white dark:text-white dark:hover:text-white"
      >
        Reset Email
      </Button>
    </form>
  );
};
