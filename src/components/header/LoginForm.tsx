"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { login } from "@/shared/actions/auth.action";
import { LoginSchema } from "@/shared/schemas/auth.schema";
import { signIn } from "next-auth/react";

interface LoginDialogTriggerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
}

export function LoginDialogTrigger({
  open,
  onOpenChange,
  onSwitchToSignup,
}: LoginDialogTriggerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", code: "" },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await login(values);

      if ("message" in res) {
        setError(res.message || "Đã xảy ra lỗi");
        return;
      }

      if ("twoFactor" in res && res.twoFactor) {
        setShowTwoFactor(true);
        setSuccess("A verification code has been sent to your email.");
        return;
      }

      if ("success" in res && res.success) {
        const signInRes = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (signInRes?.error) {
          setError("Authentication failed.");
          return;
        }

        onOpenChange(false); // đóng dialog
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center">
          <LogIn className="mr-1 h-4 w-4" />
          Login
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {(error || success) && (
            <Alert variant={error ? "destructive" : "default"}>
              <AlertDescription>{error || success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet className="gap-4">
              <FieldLegend>
                {showTwoFactor ? "Two-Factor Authentication" : "Login"}
              </FieldLegend>
              <FieldGroup className="gap-4">
                {!showTwoFactor ? (
                  <>
                    {/* EMAIL */}
                    <Controller
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                {...field}
                                placeholder="email@example.com"
                              />
                            </InputGroup>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    {/* PASSWORD */}
                    <Controller
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldContent>
                            <InputGroup>
                              <InputGroupInput
                                {...field}
                                type="password"
                                placeholder="******"
                              />
                            </InputGroup>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm">
                          Remember me
                        </Label>
                      </div>
                      <Link href="/auth/forgot-password">
                        <Button variant="link" size="sm" className="px-0">
                          Forgot Password?
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <Controller
                    control={form.control}
                    name="code"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput {...field} placeholder="123456" />
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </FieldContent>
                      </Field>
                    )}
                  />
                )}
              </FieldGroup>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending
                  ? "Logging in..."
                  : showTwoFactor
                    ? "Confirm"
                    : "Sign In"}
              </Button>
            </FieldSet>
          </form>

          <div className="text-center text-sm">
            <p>Don&apos;t have an account?</p>
            <Button variant="link" onClick={onSwitchToSignup}>
              Create an Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
