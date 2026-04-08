import db from "@/lib/prisma";
import { notFound } from "next/navigation";
import CourseDetailClient from "@/components/course/CourseDetailClient";
import { CheckMemberShip } from "@/shared/actions/membership";
import { Header } from "@/components/header";
import { Container } from "@/components/customs/Container";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await CheckMemberShip();
  const isVip = res.success && res.plan && !res.isExpired;

  const course = await db.course.findFirst({
    where: { slug },
    include: {
      Lectures: {
        include: {
          Lessons: {
            orderBy: { order: "asc" }, // Đảm bảo bài học sắp xếp đúng thứ tự
          },
        },
        orderBy: { order: "asc" }, // Sắp xếp chương theo thứ tự
      },
    },
  });

  if (!course) {
    notFound();
  }
  return (
    <>
      <Header />
      <Container className="pt-4 lg:pt-12">
        <CourseDetailClient
          course={JSON.parse(JSON.stringify(course))}
          isVipServer={!!isVip}
        />
      </Container>
    </>
  );
}
