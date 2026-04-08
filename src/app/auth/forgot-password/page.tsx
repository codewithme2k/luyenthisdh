import { ResetForm } from "@/components/auth/forget-form";

export default async function ForgetPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-5">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Forget password</h1>
          <p className="mt-2 text-sm text-muted-foreground"></p>
        </div>
        <ResetForm />
      </div>
    </div>
  );
}
