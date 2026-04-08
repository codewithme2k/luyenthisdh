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

import Swal from "sweetalert2";
import { ERatingStatus, Rating } from "@/generated/prisma/client";
const RatingStatus: Record<
  ERatingStatus,
  {
    text: string;
    className: string;
  }
> = {
  Approved: {
    text: "Đã duyệt",
    className: "bg-primary text-foreground",
  },

  Pending: {
    text: "Đang đợi",
    className: "bg-orange-600 text-foreground",
  },
  Rejected: {
    text: "Từ chối",
    className: "bg-red-600 text-foreground",
  },
};
export const columns: ColumnDef<
  Rating & {
    course: { name: string; id: string } & {
      user: { name: string; id: string };
    };
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
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "score",
    header: "Điểm",
    cell: ({ getValue }) => {
      const score = getValue<number>();

      const emojiMap: Record<number, { icon: string; label: string }> = {
        1: { icon: "😢", label: "Rất tệ" },
        2: { icon: "😞", label: "Tệ" },
        3: { icon: "😐", label: "Bình thường" },
        4: { icon: "😊", label: "Tốt" },
        5: { icon: "😍", label: "Tuyệt vời" },
      };

      const emotion = emojiMap[score];

      if (!emotion)
        return <span className="text-muted-foreground text-sm">Không rõ</span>;

      return (
        <div className="flex items-center gap-2">
          <span className="text-xl">{emotion.icon}</span>
          <span className="text-sm font-medium">
            {score} – {emotion.label}
          </span>
        </div>
      );
    },
  },
  { accessorKey: "user.name", header: "Tên người dùng" },
  { accessorKey: "course.name", header: "Khóa học" },

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
    cell: ({ getValue }) => {
      const status = getValue() as keyof typeof RatingStatus;
      const statusInfo = RatingStatus[status];
      if (!statusInfo)
        return <span className="text-muted-foreground">Unknown</span>;
      return (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 font-medium rounded ${statusInfo.className}`}
          >
            {statusInfo.text}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rating = row.original;

      const handleChangeStatus = async () => {
        const { isConfirmed, value: newStatus } = await Swal.fire({
          title: "Thay đổi trạng thái",
          text: "Chọn trạng thái mới cho đánh giá này.",
          input: "select",
          inputOptions: {
            Pending: "Chờ duyệt",
            Approved: "Đã duyệt",
            Rejected: "Từ chối",
          },
          inputPlaceholder: "Chọn trạng thái",
          showCancelButton: true,
          confirmButtonText: "Cập nhật",
          cancelButtonText: "Huỷ",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#aaa",
        });

        if (!isConfirmed || !newStatus) return;

        try {
          const res = await fetch("/api/rating", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ratingId: rating.id,
              // courseId: rating.courseId,
              approved: newStatus === "Approved",
            }),
          });

          if (!res.ok) throw new Error();

          await Swal.fire(
            "Thành công",
            "Trạng thái đã được cập nhật.",
            "success",
          );
          location.reload(); // hoặc dùng router.refresh() nếu dùng next/router hoặc next/navigation
        } catch (error) {
          console.log(error);
          Swal.fire("Thất bại", "Không thể cập nhật trạng thái.", "error");
        }
      };

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
            className="bg-background text-neutral-900 dark:bg-dark dark:text-gray-100"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleChangeStatus}>
              Thay đổi trạng thái
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
