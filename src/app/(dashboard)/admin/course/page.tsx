import { db } from "@/lib/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Course() {
  const data = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      Subject: true,
    },
  });
  return (
    <div className="container mx-auto p-2 ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
