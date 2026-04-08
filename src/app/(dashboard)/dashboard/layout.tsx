"use client";

import { useSidebar } from "@/components/dashboard/layout/SidebarProvider";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isOpen, isMobile } = useSidebar();

  // 🔥 Quan trọng: chặn khi chưa xác định client
  if (isMobile === null) return null;

  if (!isOpen && !isMobile) {
    return (
      <div className="flex-1 bg-background ml-16 text-neutral-900 dark:bg-dark dark:text-gray-100">
        {children}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-neutral-900 dark:bg-dark dark:text-red-200">
      {children}
    </div>
  );
}
