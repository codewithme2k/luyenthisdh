import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const authRoutes = ["/auth/login", "/auth/register"];
const apiAuthPrefix = "/api/auth";
const DEFAULT_LOGIN_REDIRECT = "/dashboard";
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/admin",
  // Thêm các route cần bảo vệ ở đây
];

export const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Kiểm tra xem route hiện tại có nằm trong danh sách cần bảo vệ không
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`),
  );

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Chỉ chuyển hướng đến trang đăng nhập nếu route cần được bảo vệ
  if (!isLoggedIn && isProtectedRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  // Vẫn giữ logic bảo vệ route admin
  if (
    isLoggedIn &&
    req.auth?.user?.role !== "ADMIN" &&
    req.auth?.user?.role !== "MANAGER" &&
    nextUrl.pathname.startsWith("/admin")
  ) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
