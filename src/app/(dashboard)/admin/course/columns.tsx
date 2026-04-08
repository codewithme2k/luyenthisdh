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
import Image from "next/image";
import { changeCourseStatus } from "@/shared/actions/course.action";
import { Course, ECourseStatus, Subject } from "@/generated/prisma/client";
export const CourseStatus: Record<
  ECourseStatus,
  {
    text: string;
    className: string;
  }
> = {
  PUBLISHED: {
    text: "Đã duyệt",
    className: "bg-green-500 text-foreground",
  },

  DRAFT: {
    text: "Tạm ẩn",
    className: "bg-red-600 text-foreground",
  },
};
export const columns: ColumnDef<Course & { Subject: Subject }>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "Subject.name",
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
      const subject = row.original.Subject.name;
      return <div className=" whitespace-pre-wrap break-words">{subject}</div>;
    },
  },
  { accessorKey: "salePrice", header: "Giá Sale" },
  { accessorKey: "level", header: "Trình độ" },
  { accessorKey: "views", header: "View" },
  { accessorKey: "label", header: "Nhãn" },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.image;
      return imageUrl ? (
        <Image
          src={imageUrl}
          width={100}
          height={50}
          alt="Blog image"
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
      const status = getValue() as keyof typeof CourseStatus;
      const statusInfo = CourseStatus[status];
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
              trueValue: "PUBLISHED",
              falseValue: "DRAFT",
            }}
            onChange={async (newStatus) => {
              return await changeCourseStatus(row.original.id, newStatus);
            }}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;

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
              <Link href={`/admin/course/${course.slug}/rating`}>
                Danh sách đánh giá
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/admin/course/edit/${course.slug}`}>
                Edit khoá học
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admin/course/${course.slug}/content/`}>
                Chỉnh sửa nội dung
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/admin/course/${course.slug}/upload/`}>
                Upload nội dung
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
