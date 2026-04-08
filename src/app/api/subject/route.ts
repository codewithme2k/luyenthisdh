import { NextResponse } from "next/server";

import slugify from "slugify";
import { currentRole } from "@/shared/hooks/auth";
import { db } from "@/lib/prisma";
import { Subject } from "@/generated/prisma";

export async function POST(req: Request) {
  const role = await currentRole();

  if (!role || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, slug, image } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const finalSlug =
      typeof slug === "string" && slug.trim() !== ""
        ? slugify(slug, { lower: true, locale: "vi" })
        : slugify(name, { lower: true, locale: "vi" });

    // Kiểm tra tồn tại theo name hoặc slug
    const existingSubject = await db.subject.findFirst({
      where: {
        OR: [{ name: name.trim() }, { slug: finalSlug }],
      },
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: "Subject with same name or slug already exists" },
        { status: 409 },
      );
    }

    const subject = await db.subject.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        image: image,
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const role = await currentRole();

  if (!role || role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, name, slug, status, image } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const existingSubject = await db.subject.findUnique({ where: { id } });

    if (!existingSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const dataToUpdate: Partial<
      Pick<Subject, "name" | "slug" | "status" | "updatedAt" | "image">
    > = {
      updatedAt: new Date(),
    };

    if (name) dataToUpdate.name = name;
    if (slug) dataToUpdate.slug = slug;
    if (status) dataToUpdate.status = status;
    if (image) dataToUpdate.image = image;

    const subject = await db.subject.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(subject, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
