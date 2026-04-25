"use client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EVipPlan, User } from "@/generated/prisma";
import { PlanStatus } from "@/shared/constants";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<
  User & {
    membership: { plan: EVipPlan; endDate: Date | null }[];
  }
>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "email",
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vai trò
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleString("vi-VN");
    },
  },
  {
    accessorKey: "isTwoFactorEnabled",
    header: "TwoFactor",
  },
  {
    accessorKey: "membership",
    header: "Gói VIP",
    cell: ({ row }) => {
      const rawMembership = row.original?.membership;
      const memberships = Array.isArray(rawMembership)
        ? rawMembership
        : rawMembership
          ? [rawMembership]
          : [];
      if (memberships.length === 0) {
        return (
          <span className="px-2 py-1 text-sm font-medium rounded text-muted-foreground bg-secondary/30">
            Free
          </span>
        );
      }

      return (
        <div className="flex flex-col gap-1.5">
          {memberships.map((m, idx) => {
            const info = PlanStatus[m.plan];

            return (
              <div
                key={idx}
                className={cn(
                  "inline-flex items-center w-fit px-2 py-0.5 rounded text-xs font-semibold border",
                  info?.className ||
                    "bg-gray-100 text-gray-600 border-transparent",
                )}
              >
                <span>{info?.text || m.plan}</span>

                {m.endDate && (
                  <span className="ml-1.5 opacity-80 font-normal text-white">
                    • {new Date(m.endDate).toLocaleDateString("vi-VN")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "Enrollment",
    header: "Courses",
    cell: ({ row }) => {
      return "No Courses";
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-background text-neutral-900 dark:bg-dark dark:text-gray-100 "
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admin/user/edit/${user.id}`}>Edit Thành viên</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
