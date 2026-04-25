import EditUserForm from "@/components/dashboard/user/UpdateUserForm";
import db from "@/lib/prisma";
import { currentRole } from "@/shared/hooks/auth";
import { EUserRole } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: { slug: string } }) {
  const role = await currentRole();
  if (role !== EUserRole.ADMIN) return notFound();
  const slug = params.slug;
  const user = await db.user.findUnique({
    where: {
      id: slug,
    },
  });
  if (!user) {
    return <div>User not found</div>;
  }
  return <EditUserForm user={user} id={slug} />;
}
