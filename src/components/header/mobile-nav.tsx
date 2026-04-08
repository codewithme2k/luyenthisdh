"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Twemoji } from "@/components/customs/twemoji";
import { Logo } from "./logo";

// Import Shadcn UI
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SITE_METADATA } from "@/shared/site-metadata";
import Link from "next/link";
import { HEADER_NAV_LINKS, MORE_NAV_LINKS } from "@/shared/constants/menu";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Gộp các link lại một lần
  const allLinks = [...HEADER_NAV_LINKS, ...MORE_NAV_LINKS];

  return (
    <div className="sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Trigger: Nút bấm để mở menu */}
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Toggle Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            data-umami-event="mobile-nav-toggle"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </SheetTrigger>

        {/* Content: Nội dung Menu bay từ phải vào */}
        <SheetContent
          side="right"
          className="w-full p-0 border-none bg-white dark:bg-gray-950"
        >
          {/* Header bên trong Menu */}
          <div className="flex items-center gap-3 pt-8 pl-10 border-b border-gray-100 dark:border-gray-800 pb-6">
            <Logo />
            <SheetTitle className="font-bold text-xl tracking-tight">
              {SITE_METADATA.headerTitle}
            </SheetTitle>
          </div>

          {/* Danh sách Links điều hướng */}
          <nav className="mt-8 flex flex-col items-start gap-2 px-10 overflow-y-auto h-[calc(100vh-150px)]">
            {allLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={() => setOpen(false)} // Đóng menu sau khi click
                className="group flex items-center w-full py-4 text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all border-b border-gray-50 dark:border-gray-900"
              >
                <Twemoji emoji={link.emoji} size={"2x"} />
                <span className="ml-4 group-hover:translate-x-2 transition-transform duration-300">
                  {link.title}
                </span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
