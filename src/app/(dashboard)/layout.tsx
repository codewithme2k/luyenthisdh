"use server";

import { Header } from "@/components/dashboard/layout/Header";
import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { SidebarProvider } from "@/components/dashboard/layout/SidebarProvider";
import { currentRole, currentUser } from "@/shared/hooks/auth";
import { notFound } from "next/navigation";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    return notFound();
  }
  const role = await currentRole();
  if (!role) return notFound();

  return (
    <div className=" flex flex-col">
      <SidebarProvider>
        <div className="flex flex-1">
          <Sidebar role={role} />
          <div className="flex flex-1 flex-col">
            <Header />
            <main
              className="flex-1 bg-background
               text-neutral-900
            dark:bg-dark dark:text-gray-100"
            >
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
