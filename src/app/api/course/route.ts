import slugify from "slugify";
import { currentUser } from "@/shared/hooks/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ECourseLevel, Prisma } from "@/generated/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "9");
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";

    // Thêm các trường lọc mới
    const level = searchParams.get("level") || "";
    const discount = searchParams.get("discount") || "";
    const rating = searchParams.get("rating") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const offset = (page - 1) * limit;
    const where: Prisma.CourseWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (categoryId) {
      where.subjectId = categoryId;
    }

    // Thêm điều kiện lọc level
    if (level) {
      where.level = level as ECourseLevel;
    }

    // Lọc discount: "Free", "Paid", "Discount"
    if (discount) {
      if (discount === "Free") {
        where.free = true;
      } else if (discount === "Paid") {
        where.free = false;
        where.salePrice = { equals: undefined };
      } else if (discount === "Discount") {
        where.free = false;
        where.salePrice = { not: undefined };
      }
    }

    // Lọc rating: integer từ 1 đến 5
    if (rating) {
      const ratingValue = parseInt(rating);
      if (!isNaN(ratingValue)) {
        where.Rating = {
          some: {
            score: {
              gte: ratingValue,
            },
          },
        };
      }
    }

    const orderBy: Prisma.CourseOrderByWithRelationInput = {};
    if (sortBy === "name") {
      orderBy.name = sortOrder as Prisma.SortOrder;
    } else if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder as Prisma.SortOrder;
    }

    const totalCount = await db.course.count({ where });

    const courses = await db.course.findMany({
      where,
      include: {
        Subject: true,
      },
      orderBy,
      skip: offset,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, slug, subjectId } = body;

    if (!name || !subjectId) {
      return NextResponse.json(
        { error: "Name and Subject ID are required" },
        { status: 400 },
      );
    }

    const finalSlug =
      typeof slug === "string" && slug.trim() !== ""
        ? slugify(slug, { lower: true, locale: "vi" })
        : slugify(name, { lower: true, locale: "vi" });

    // Kiểm tra tồn tại theo name hoặc slug
    const existingCourse = await db.course.findFirst({
      where: {
        OR: [{ name: name.trim() }, { slug: finalSlug }],
      },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "Course with same name or slug already exists" },
        { status: 409 },
      );
    }

    const subject = await db.course.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        subjectId: subjectId,
        authorId: user.id,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  const user = await currentUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      slug,
      name,
      subjectId,
      cta,
      price,
      salePrice,
      intro,
      image,
      description,
      level,
      status,
      seoKeywords,
      free,
      info,
    } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const existingCourse = await db.course.findUnique({
      where: { slug },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const updatedCourse = await db.course.update({
      where: { slug },
      data: {
        name: name?.trim(),
        subjectId,
        cta,
        price: Number(price),
        salePrice: Number(salePrice),
        intro,
        image,
        description,
        level,
        status,
        seoKeywords,
        free,
        info,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
