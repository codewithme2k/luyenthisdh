import { db } from "@/lib/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Rating({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const course = await db.course.findUnique({
    where: { slug: (await params).slug },
  });
  if (!course) {
    return <div>Khóa học không tồn tại.</div>;
  }
  const data = await db.rating.findMany({
    where: { courseId: course.id },
    orderBy: { createdAt: "desc" },

    include: {
      course: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Transform data to nest user inside course
  const transformedData = data.map((item) => ({
    ...item,
    course: {
      ...item.course,
      user: item.user
        ? { id: item.user.id, name: item.user.name ?? "" }
        : { id: "", name: "" },
    },
  }));

  return (
    <div className="container mx-auto p-2 ">
      <DataTable columns={columns} data={transformedData} />
    </div>
  );
}
