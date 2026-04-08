import { auth } from "@/lib/auth";
/// dung trenn server
export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();
  return session?.user.role;
};
