import AccessDenied from "@/components/customs/AccessDenied";
import { BankTransferCheckout } from "@/components/membership/BankTransferCheckout";
import { EVipPlan } from "@/generated/prisma";

import { db } from "@/lib/prisma";
import { currentUser } from "@/shared/hooks/auth";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await currentUser();
  if (!user) {
    return <AccessDenied></AccessDenied>;
  }
  const order = await db.order.findFirst({
    where: {
      id: (await params).slug,
      userId: user.id,
    },
    include: {
      Membership: true,
    },
  });
  if (!order) return notFound();

  function planToText(plan: EVipPlan): string {
    switch (plan) {
      case "MONTHLY":
        return "Gói Tháng";
      case "HALF_YEAR":
        return "Gói 6 Tháng";
      case "YEARLY":
        return "Gói Năm";
      case "LIFETIME":
        return "Gói Trọn đời";
      default:
        return "Không rõ";
    }
  }
  return (
    <BankTransferCheckout
      orderId={order.code}
      courseTitle={
        order.Membership?.plan ? planToText(order.Membership.plan) : "Không rõ"
      }
      amount={order.price}
      bank={{
        name: "MB Bank",
        accountNumber: "123456789",
        accountName: "NGUYEN VAN A",
      }}
    />
  );
}
