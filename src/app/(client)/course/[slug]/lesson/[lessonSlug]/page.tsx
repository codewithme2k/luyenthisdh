import LessonViewClient from "@/components/course/LessonViewClient";
import db from "@/lib/prisma";
import { CheckMemberShip } from "@/shared/actions/membership";
import { notFound } from "next/navigation";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const res = await CheckMemberShip();
  const isVip = res.success && res.plan && !res.isExpired;
  const { lessonSlug } = await params;
  const lesson = await db.lesson.findFirst({
    where: { slug: lessonSlug },
    include: {
      lecture: {
        include: {
          course: {
            include: {
              Lectures: {
                include: { Lessons: true },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  return (
    <LessonViewClient
      lesson={JSON.parse(JSON.stringify(lesson))}
      isVipServer={!!isVip}
      planName={res.plan}
    />
  );
}
