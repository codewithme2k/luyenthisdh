import UploadLecture from "@/components/admin/course/Upload";
import db from "@/lib/prisma";
import { currentUser } from "@/shared/hooks/auth";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const course = await db.course.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!course) {
    return <div>Test not found</div>;
  }
  const user = await currentUser();
  if (!user) {
    return <div>User not found</div>;
  }
  return <UploadLecture course={course} userId={user.id} />;
}
