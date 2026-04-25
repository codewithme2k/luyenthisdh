import { db } from "@/lib/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Course() {
  const data = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      Membership: {
        select: {
          plan: true,
          isActive: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          name: true,
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
