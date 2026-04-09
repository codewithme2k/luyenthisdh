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
  if (status === "loading") return null;

  if (session?.user) {
    return (
      <div className=" items-center gap-2">
        <UserMenu session={session} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
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
