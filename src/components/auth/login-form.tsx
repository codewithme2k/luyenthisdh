"use client";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { login } from "@/shared/actions/auth.action";
import { FormSucess } from "../customs/form-sucess";
import { z } from "zod";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [hasRequested2FA, setHasRequested2FA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | undefined>("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();
  const LoginSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(6, {
      message: "Password is required",
    }),
    code: z.string().optional(),
    redirectTo: z.any(),
  });
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError(null);

    startTransition(async () => {
      const result = await login(values);

      if ("message" in result) {
        setError(result.message || "Đã xảy ra lỗi");
        return;
      }

      if ("twoFactor" in result && result.twoFactor) {
        if (!hasRequested2FA) {
          setShowTwoFactor(true);
          setHasRequested2FA(true);
          setSuccess("A verification code has been sent to your email.");
        }
        return;
      }

      if ("success" in result && result.success) {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid credentials");
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          {showTwoFactor && (
            /* 2FA */
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="code">Two Factor Code</FieldLabel>
                  <Input
                    {...field}
                    id="code"
                    disabled={isPending}
                    placeholder="123456"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          {!showTwoFactor && (
            <>
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </>
          )}
        </FieldGroup>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white"
          disabled={isPending}
        >
          {showTwoFactor ? "Confirm" : "Login"}
        </Button>
      </form>

      <FormSucess message={success} />

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-medium underline">
          Register
        </Link>
      </div>
      <div className="text-center text-sm">
        Forgot your password?{" "}
        <Link href="/auth/forgot-password" className="font-medium underline">
          Reset
        </Link>
      </div>
    </div>
  );
}
