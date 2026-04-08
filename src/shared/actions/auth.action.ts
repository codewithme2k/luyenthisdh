"use server";
import bcrypt from "bcryptjs";

import { getUserByEmail } from "./user.action";
import { z } from "zod";
import { signOut } from "@/lib/auth";
import db from "@/lib/prisma";
import {
  generateTwoFactorToken,
  generateVerificationToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
} from "@/lib/token";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { LoginSchema, RegisterSchema } from "@/shared/schemas/auth.schema";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) {
    return { message: "Invalid fields!" };
  }

  const { email, password, code } = validated.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password) {
    return { message: "Email or password is incorrect!" };
  }
  if (!existingUser.email) {
    return { message: "Email not provided!" };
  }
  const emailCheck = await checkEmailVerification(
    existingUser.email,
    existingUser.id,
  );
  if (emailCheck) return { message: emailCheck.message };

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return { message: "Email or password is incorrect!" };
  }

  const twoFactorCheck = await handleTwoFactorAuth(existingUser, code);
  if (twoFactorCheck) {
    if ("twoFactor" in twoFactorCheck) return { twoFactor: true };
    if ("message" in twoFactorCheck) return { message: twoFactorCheck.message };
  }

  return { success: true };
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const data = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const verificationToken = await generateVerificationToken(email, data.id);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return {
    sucess: "Đăng kí thành công. Vui lòng kiểm tra email để tiếp tục",
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkEmailVerification = async (
  email: string,
  userId: string,
): Promise<{ message: string } | null> => {
  const user = await db.user.findUnique({ where: { email } });
  if (user?.emailVerified) return null;

  const token = await generateVerificationToken(email, userId);
  await sendVerificationEmail(token.email, token.token);

  return { message: "Email not verified. Verification email sent!" };
};

export const handleTwoFactorAuth = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any,
  code?: string,
): Promise<{ message: string } | { twoFactor: boolean } | null> => {
  if (!user.isTwoFactorEnabled || !user.email) return null;

  if (!code) {
    const existingToken = await getTwoFactorTokenByEmail(user.email);

    const isExpired = existingToken
      ? new Date(existingToken.expires) < new Date()
      : true;

    if (!existingToken || isExpired) {
      const token = await generateTwoFactorToken(user.email);
      await sendTwoFactorTokenEmail(token.email, token.token);
    }

    return { twoFactor: true };
  }

  const storedToken = await getTwoFactorTokenByEmail(user.email);
  if (!storedToken || storedToken.token !== code) {
    return { message: "Invalid or expired 2FA code" };
  }

  if (new Date(storedToken.expires) < new Date()) {
    return { message: "2FA code expired" };
  }

  await db.twoFactorToken.delete({ where: { id: storedToken.id } });

  const existing = await getTwoFactorConfirmationByUserId(user.id);
  if (existing) {
    await db.twoFactorConfirmation.delete({ where: { id: existing.id } });
  }

  await db.twoFactorConfirmation.create({ data: { userId: user.id } });

  return null;
};
