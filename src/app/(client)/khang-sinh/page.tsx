import React from "react";
import { KhangSinhViewer } from "@/app/(client)/(WithHeader)/drug/khang-sinh-viewer";
import { Metadata } from "next";
import { CheckMemberShip } from "@/shared/actions/membership";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Phác đồ sử dụng Kháng sinh",
  description:
    "Tra cứu nhanh hướng dẫn sử dụng kháng sinh theo kinh nghiệm và kết quả vi sinh.",
};

export default async function KhangSinhPage() {
  const res = await CheckMemberShip();
  const isVip = res.success && res.plan && !res.isExpired;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* <Header /> */}
      <main className="flex-1 overflow-hidden">
        <KhangSinhViewer isVip={!!isVip} />
      </main>
    </div>
  );
}
