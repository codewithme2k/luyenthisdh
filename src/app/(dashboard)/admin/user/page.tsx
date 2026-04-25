import { db } from "@/lib/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function TagDataPage() {
  const data = await db.user.findMany({
    include: {
      membership: {
        select: {
          endDate: true,
          plan: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto p-2 ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
