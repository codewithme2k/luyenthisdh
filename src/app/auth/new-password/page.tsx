import { NewPassWordForm } from "@/components/auth/NewPasswordForm";
import { Suspense } from "react";

export default async function NewPasswordPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <div className="flex min-h-screen flex-col items-center justify-center p-5">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">New password</h1>
            <p className="mt-2 text-sm text-muted-foreground"></p>
          </div>
          <NewPassWordForm />
        </div>
      </div>
    </Suspense>
  );
}
