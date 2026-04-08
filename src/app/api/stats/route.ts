import { NextRequest } from "next/server";

import { StatsType } from "@/generated/prisma/enums";
import db from "@/lib/prisma";

// Khởi tạo Prisma Client (Thông thường nên đặt ở file riêng như @/lib/prisma.ts)

export async function GET(request: NextRequest) {
  try {
    const { searchParams: params } = new URL(request.url);
    const slug = params.get("slug");
    const type = params.get("type") as StatsType;

    if (!slug || !type) {
      return Response.json(
        { message: "Missing `type` or `slug` parameter!" },
        { status: 400 },
      );
    }

    // Prisma: Tìm hoặc tạo mới bản ghi nếu chưa tồn tại (upsert)
    // Hoặc chỉ tìm với findUnique
    let data = await db.stats.findUnique({
      where: {
        type_slug: { type, slug },
      },
    });

    // Nếu không có dữ liệu, trả về object mặc định để tránh lỗi frontend
    if (!data) {
      data = await db.stats.create({
        data: {
          type,
          slug,
          views: 0,
          loves: 0,
          applauses: 0,
          ideas: 0,
          bullseyes: 0,
        },
      });
    }

    return Response.json(data);
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "Internal Server Error!" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, slug, ...updates } = body;

    if (!slug || !type) {
      return Response.json(
        { message: "Missing `type` or `slug` parameter!" },
        { status: 400 },
      );
    }

    // Prisma: Cập nhật dữ liệu dựa trên type và slug
    const updatedStats = await db.stats.update({
      where: {
        type_slug: { type, slug },
      },
      data: updates,
    });

    return Response.json(updatedStats);
  } catch (e) {
    console.error(e);
    // Trường hợp bản ghi không tồn tại khi POST
    if ((e as any).code === "P2025") {
      return Response.json({ message: "Stats not found!" }, { status: 404 });
    }
    return Response.json(
      { message: "Internal Server Error!" },
      { status: 500 },
    );
  }
}
