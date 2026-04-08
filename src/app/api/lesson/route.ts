import { NextResponse } from "next/server";
import { currentUser } from "@/shared/hooks/auth";
import db from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Chưa đăng nhập" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { success: false, message: "Thiếu hoặc sai định dạng slug" },
        { status: 400 },
      );
    }

    const lesson = await db.lesson.findUnique({
      where: { slug: slug },
      include: { course: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Bài học không tồn tại" },
        { status: 404 },
      );
    }
    const isFree = lesson.isFree;
    const courseId = lesson.courseId;

    // const hasPaid = await db.enrollment.findFirst({
    //   where: {
    //     userId: user.id,
    //     courseId: courseId,
    //     paymentStatus: EPaymentStatus.PAID,
    //   },
    // });

    // if (!isFree && !hasPaid) {
    //   return NextResponse.json(
    //     { success: false, message: "Bạn chưa mua khóa học này" },
    //     { status: 403 },
    //   );
    // }

    const videoUrl = lesson.iframe || lesson.video;

    if (!videoUrl) {
      return NextResponse.json(
        { success: false, message: "Bài học chưa có video hoặc iframe" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, videoUrl }, { status: 200 });
  } catch (error) {
    console.error("[API /lesson] Lỗi server:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi server. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
