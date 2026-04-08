import EditSubject from "@/components/admin/subject/EditSubject";
import { db } from "@/lib/prisma";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const subject = await db.subject.findUnique({
    where: { slug },
  });

  if (!subject) {
    return <div>Không tìm thấy môn học</div>;
  }

  return <EditSubject data={subject} slug={slug} />;
};

export default page;
