"use client";

import React from "react";
import { Lock, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-background">
      <div className="relative max-w-md w-full bg-card border border-border rounded-3xl shadow-sm p-8 text-center overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Hiệu ứng ánh sáng nền mờ ảo (Glow effect) cho chế độ Dark Mode */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 dark:bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* Biểu tượng Ổ khóa cao cấp */}
        <div className="relative flex justify-center mb-6">
          <div className="relative flex items-center justify-center w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full border-8 border-background z-10">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />

            {/* Badge nhỏ đính kèm icon */}
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
              <div className="bg-blue-600 text-white rounded-full p-1">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </div>
          {/* Vòng tròn trang trí mờ phía sau */}
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full scale-125 animate-pulse-slow" />
        </div>

        {/* Thông điệp */}
        <div className="relative z-10 space-y-3 mb-8">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Nội dung dành riêng cho VIP
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bài học này chứa các kiến thức chuyên sâu và tài liệu độc quyền. Vui
            lòng nâng cấp tài khoản để mở khóa toàn bộ lộ trình học tập.
          </p>
        </div>

        {/* Danh sách lợi ích ngắn gọn gàng (Micro-copy) */}
        <div className="relative z-10 flex flex-col gap-2.5 mb-8 text-left bg-muted/30 dark:bg-muted/10 p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Truy cập không giới hạn mọi bài học</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-foreground/80">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Tải xuống tài liệu & template độc quyền</span>
          </div>
        </div>

        {/* Khu vực Nút bấm (Call to Actions) */}
        <div className="relative z-10 flex flex-col gap-3">
          <Link href="/pricing" className="w-full">
            <Button className="w-full h-12 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md transition-all hover:-translate-y-0.5">
              Xem các gói nâng cấp
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full h-12 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang trước
          </Button>
        </div>
      </div>
    </div>
  );
}
