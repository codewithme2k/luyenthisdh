/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultSession, NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { getUserByEmail } from "@/shared/actions/user.action";
import { getTwoFactorConfirmationByUserId } from "./token";
import { db } from "./prisma";

// extend the types to include role
declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN" | "MANAGER";
  }
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN" | "MANAGER";
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "ADMIN" | "MANAGER";
  }
}

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/login",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        return isLoggedIn && auth?.user?.role === "ADMIN";
      } else if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role ?? "USER";
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        if (token.role) {
          session.user.role = token.role;
        }
      }
      return session;
    },
  },

  providers: [
    // GitHub({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@exmple.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await getUserByEmail(email);

        if (!user) return null;
        if (!user?.emailVerified) return null;

        if (user.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            user.id,
          );

          if (!twoFactorConfirmation) return null;

          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }
        const passwordsMatch = await bcrypt.compare(
          password,
          user.password || "",
        );

        if (!passwordsMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
};
