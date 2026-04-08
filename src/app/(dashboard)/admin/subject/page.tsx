import db from "@/lib/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function DemoPage() {
  const data = await db.subject.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto p-2 ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
