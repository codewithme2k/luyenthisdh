"use server";
import EditCourseForm from "@/components/admin/course/EditCourse";
import { db } from "@/lib/prisma";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await db.course.findFirst({
    where: {
      slug: slug,
    },
  });
  console.log(course);
  if (!course) {
    return <div>Test not found</div>;
  }
  const subjects = await db.subject.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <EditCourseForm
      data={course}
      subjects={subjects.map((subject) => ({
        label: subject.name,
        value: subject.id,
      }))}
    />
  );
}
