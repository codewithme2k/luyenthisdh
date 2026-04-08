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
import { StatusSwitch } from "@/components/customs/CustomSwitch";
import { changeSubjectStatus } from "@/shared/actions/subject.action";
import Image from "next/image";
import { ESubjectStatus, Subject } from "@/generated/prisma";
const SubjectStatus: Record<
  ESubjectStatus,
  {
    text: string;
    className: string;
  }
> = {
  ACTIVE: {
    text: "Đã duyệt",
    className: "bg-green-500 text-foreground",
  },

  INACTIVE: {
    text: "Tạm ẩn",
    className: "bg-red-600 text-foreground",
  },
};
export const columns: ColumnDef<Subject>[] = [
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
    accessorKey: "slug",
    header: "slug",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.image;
      return imageUrl ? (
        <Image
          src={imageUrl}
          width={40}
          height={40}
          alt="subject image"
          className="object-cover rounded"
        />
      ) : (
        <span className="text-sm text-muted-foreground">No image</span>
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
      const status = getValue() as keyof typeof SubjectStatus;
      const statusInfo = SubjectStatus[status];
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
              trueValue: "ACTIVE",
              falseValue: "INACTIVE",
            }}
            onChange={async (newStatus) => {
              return await changeSubjectStatus(row.original.id, newStatus);
            }}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subject = row.original;

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
              onClick={() => navigator.clipboard.writeText(subject.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admin/subject/edit/${subject.slug}`}>
                Edit subject
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
