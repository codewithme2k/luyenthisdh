"use client";

import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { register } from "@/shared/actions/auth.action";
import { FormError } from "../customs/form-error";
import { FormSucess } from "../customs/form-sucess";
import { RegisterSchema } from "@/shared/schemas/auth.schema";

export function RegisterForm() {
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
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <InputGroupInput {...field} placeholder="John Doe" />
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
          </FieldGroup>

          <FormError message={error ?? undefined} />
          <FormSucess message={sucess ?? undefined} />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isPending}
          >
            {isPending ? "Registering..." : "Register"}
          </Button>
        </FieldSet>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium underline">
          Login
        </Link>
      </div>

      <div className="text-center text-sm">
        <Link href="/" className="font-medium underline">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
