import { useSession } from "next-auth/react";
import { LoginDialogTrigger } from "./LoginForm";
import { RegisterDialogTrigger } from "./RegisterForm";
import { UserMenu } from "@/components/header/UserMenu";

interface AuthButtonsProps {
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  signupOpen: boolean;
  setSignupOpen: (open: boolean) => void;
}

export function AuthButtons({
  loginOpen,
  setLoginOpen,
  signupOpen,
  setSignupOpen,
}: AuthButtonsProps) {
  const { data: session, status } = useSession();

  // Nếu chưa tải xong session, có thể hiện loading (nếu cần)
  if (status === "loading") return null;

  // Nếu đã đăng nhập → hiện Avatar
  if (session?.user) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <UserMenu session={session} />
      </div>
    );
  }

  // Nếu chưa đăng nhập → hiện Login/Register
  return (
    <div className="hidden md:flex items-center gap-2">
      <LoginDialogTrigger
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
      <RegisterDialogTrigger
        open={signupOpen}
        onOpenChange={setSignupOpen}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
        hideTrigger
      />
    </div>
  );
}
