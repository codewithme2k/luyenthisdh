import CreateCourse from "@/components/admin/course/CreateCourse";
import { ESubjectStatus } from "@/generated/prisma/enums";
import db from "@/lib/prisma";

export default async function TestPage() {
  const subjects = await db.subject.findMany({
    orderBy: { name: "asc" },
    where: { status: ESubjectStatus.ACTIVE },
    select: { id: true, name: true, slug: true },
  });
  return (
    <CreateCourse
      subjects={subjects.map((subject) => ({
        label: subject.name,
        value: subject.id,
      }))}
    />
  );
}
