"use client";

import { ChevronDown } from "lucide-react";
import { GrowingUnderline } from "@/components/customs/growing-underline";
import { Twemoji } from "@/components/customs/twemoji";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MORE_NAV_LINKS } from "@/shared/constants/menu";
import Link from "next/link";

export function MoreLinks() {
  return (
    <div className="flex items-center">
      <DropdownMenu>
        {/* Trigger: Nút bấm sử dụng GrowingUnderline cũ của bạn */}
        <DropdownMenuTrigger asChild className="focus:outline-hidden">
          <button
            aria-label="More links"
            className="px-3 py-1 font-medium group"
          >
            <GrowingUnderline
              data-umami-event="nav-more-links"
              className="flex items-center gap-1"
            >
              <span>more</span>
              <ChevronDown
                strokeWidth={1.5}
                size={20}
                className="transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </GrowingUnderline>
          </button>
        </DropdownMenuTrigger>

        {/* Content: Danh sách menu đổ xuống */}
        <DropdownMenuContent
          align="end"
          className="w-40 mt-2 p-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50"
        >
          {MORE_NAV_LINKS.map(({ href, title, emoji }) => (
            <DropdownMenuItem key={href} asChild>
              <Link
                href={href}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Twemoji emoji={emoji} />
                <span data-umami-event={`nav-${href.replace("/", "")}`}>
                  {title}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
