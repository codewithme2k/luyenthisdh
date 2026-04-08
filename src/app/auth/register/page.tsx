import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đăng kí tài khoản",
};
export default async function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-5">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a new account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
