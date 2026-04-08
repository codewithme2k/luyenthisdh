"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Link from "next/link";

import { register } from "@/shared/actions/auth.action";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { FormError } from "../customs/form-error";
import { FormSucess } from "../customs/form-sucess";
import { RegisterSchema } from "@/shared/schemas/auth.schema";

interface RegisterDialogTriggerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
  hideTrigger?: boolean;
}

export function RegisterDialogTrigger({
  open,
  onOpenChange,
  onSwitchToLogin,
  hideTrigger,
}: RegisterDialogTriggerProps) {
  const [error, setError] = useState<string | null>(null);
  const [sucess, setSucess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError(null);
    setSucess(null);

    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) setError(data.error);
        if (data?.sucess) {
          setSucess(data.sucess);
          form.reset();
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <DialogTrigger>
          <Button variant="ghost" size="sm">
            Register
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>
            Create a new account to get started
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FieldSet className="gap-4">
            <FieldLegend>Register</FieldLegend>
            <FieldGroup className="gap-4">
              {/* NAME */}
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          placeholder="Enter your full name"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

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
                          type="email"
                          placeholder="Enter your email"
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
                          placeholder="Create a password"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              {/* CONFIRM PASSWORD */}
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          type="password"
                          placeholder="Confirm your password"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Terms checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="#" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <FormError message={error ?? undefined} />
            <FormSucess message={sucess ?? undefined} />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white"
              disabled={isPending}
            >
              {isPending ? "Registering..." : "Create Account"}
            </Button>
          </FieldSet>
        </form>

        <div className="text-center text-sm mt-2">
          Already have an account?{" "}
          <Button variant="link" onClick={onSwitchToLogin}>
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
