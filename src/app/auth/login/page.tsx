import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default async function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center mx-auto my-auto">Đang tải...</div>
      }
    >
      <div className="flex min-h-screen flex-col items-center justify-center p-5">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center font-quicksand">
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </Suspense>
  );
}
