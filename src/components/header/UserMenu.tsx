"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { CheckMemberShip } from "@/shared/actions/membership";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UserMenu({ session }: { session: any }) {
  const name = session?.user?.name || "User";
  const email = session?.user?.email || "";
  const image = session?.user?.image || "";
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembership = async () => {
      const res = await CheckMemberShip();
      if (res.success && res.plan && !res.isExpired) {
        setPlan(res.plan);
      }
    };
    fetchMembership();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Avatar">
        <div
          className={clsx("relative size-8 rounded-full overflow-hidden", {
            "ring-4 ring-yellow-400": plan === "LIFETIME",
            "ring-2 ring-gray-400": plan === "MONTHLY",
            "ring-2 ring-indigo-400": plan === "HALF_YEAR",
            "ring-2 ring-orange-500": plan === "YEARLY",
          })}
        >
          <Avatar className="size-8">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span
            className={clsx(
              "absolute bottom-0 left-1/2 -translate-x-1/2",
              "w-2 h-2 rotate-45", // kích thước vuông 8x8px
              "border border-white", // viền trắng nếu muốn
              {
                "ring-4 ring-yellow-400": plan === "LIFETIME",
                "ring-2 ring-gray-400": plan === "MONTHLY",
                "ring-2 ring-indigo-400": plan === "HALF_YEAR",
                "ring-2 ring-orange-500": plan === "YEARLY",
              },
            )}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
