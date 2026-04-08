"use client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { format } from "date-fns";
import { OrderStatus } from "@/shared/constants";
import { StatusSwitch } from "@/components/customs/CustomSwitch";
import { changeOrderStatus } from "@/shared/actions/order.action";
import { Membership, Order, User } from "@/generated/prisma";
export const columns: ColumnDef<
  Order & {
    Membership: Membership | null;
    user: User;
  }
>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tên
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const order = row.original.user.name;
      return <div className=" whitespace-pre-wrap break-words">{order}</div>;
    },
  },

  {
    accessorKey: "course.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Môn học
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const order = row.original.Membership?.plan;
      return <div className=" whitespace-pre-wrap break-words">{order}</div>;
    },
  },

  { accessorKey: "price", header: "Giá" },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <span className="text-sm">
          {date ? format(new Date(date), "dd/MM/yyyy HH:mm") : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, getValue }) => {
      const status = getValue() as keyof typeof OrderStatus;
      const statusInfo = OrderStatus[status];
      if (!statusInfo)
        return <span className="text-muted-foreground">Unknown</span>;
      return (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 font-medium rounded ${statusInfo.className}`}
          >
            {statusInfo.text}
          </span>
          <StatusSwitch
            status={row.original.status}
            valueMap={{
              trueValue: "SUCCESS",
              falseValue: "PENDING",
            }}
            onChange={async (newStatus) => {
              return await changeOrderStatus(row.original.id, newStatus);
            }}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

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
            <DropdownMenuItem>
              <Link href={`/admin/order/edit/${order.code}`}>
                Edit khoá order
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
