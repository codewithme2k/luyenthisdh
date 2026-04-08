import CourseContent from "@/components/admin/course/Content";
import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await db.course.findFirst({
    where: { slug: slug },
    include: {
      Lectures: {
        include: {
          Lessons: {
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });
  if (!course) {
    return notFound();
  }
  return <CourseContent data={course}></CourseContent>;
}
