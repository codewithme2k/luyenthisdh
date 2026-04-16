"use client";

import React, { useState, useEffect } from "react";
import { KHANG_SINH_DATA } from "@/app/(client)/(WithHeader)/drug/khang-sinh-data";
import { ChevronRight, ChevronLeft, Search, Lock, Menu, X } from "lucide-react";
import Zoom from "react-medium-image-zoom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function KhangSinhViewer({ isVip }: { isVip: boolean }) {
  const [selectedChapterId, setSelectedChapterId] = useState(
    KHANG_SINH_DATA[0].id,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const selectedChapter =
    KHANG_SINH_DATA.find((c) => c.id === selectedChapterId) ||
    KHANG_SINH_DATA[0];

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedChapterId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // eslint-disable-next-line react-hooks/immutability
      if (e.key === "ArrowLeft") handlePrevPage();
      // eslint-disable-next-line react-hooks/immutability
      if (e.key === "ArrowRight") handleNextPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, selectedChapterId, isVip]);

  const filteredChapters = KHANG_SINH_DATA.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < selectedChapter.count - 1)
      setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background">
      {/* Nếu bạn dùng Header, hãy đổi h-screen thành h-[calc(100vh-80px)] */}
      {/* Sidebar - Fixed Height Content */}
      <div
        className={cn(
          "shink-0 border-r bg-muted/20 flex flex-col transition-all duration-300",
          isSidebarOpen ? "w-80" : "w-0 overflow-hidden border-none",
        )}
      >
        <div className="p-4 border-b flex items-center justify-between bg-background">
          <span className="font-bold text-sm uppercase tracking-wider text-primary">
            Chuyên khoa
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-3 border-b bg-muted/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm phác đồ..."
              className="w-full bg-background border border-border/50 rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-primary/30 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-grid-scrollbar p-2">
          {filteredChapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setSelectedChapterId(chapter.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all group mb-1",
                selectedChapterId === chapter.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-md"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-2xl shrink-0">{chapter.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="truncate font-bold text-base">
                  {chapter.label}
                </div>
                {chapter.type === "images" && (
                  <div
                    className={cn(
                      "text-xs opacity-80",
                      selectedChapterId === chapter.id
                        ? "text-primary-foreground"
                        : "",
                    )}
                  >
                    {chapter.count} trang
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Workspace Area - Flex Column */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Fixed Mini Toolbar */}
        {!isSidebarOpen && (
          <Button
            variant="outline"
            size="icon-lg"
            className="absolute left-6 top-6 z-50 bg-background shadow-xl border-primary/20 rounded-2xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="size-6 text-primary" />
          </Button>
        )}

        {/* Content - Scrollable Middle */}
        <div className="flex-1 overflow-y-auto bg-muted/10 custom-grid-scrollbar relative pb-36">
          {!isVip ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-background/50 backdrop-blur-sm">
              <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 animate-pulse">
                <Lock className="size-10" />
              </div>
              <h3 className="text-3xl font-black mb-2 uppercase">
                Truy cập giới hạn VIP
              </h3>
              <p className="max-w-md text-lg text-muted-foreground mb-8 font-medium">
                Bạn cần là thành viên VIP để xem chi tiết phác đồ và hướng dẫn y
                khoa này.
              </p>
              <Button
                asChild
                className="rounded-full px-12 h-14 text-lg font-black shadow-xl shadow-primary/20 uppercase tracking-widest"
              >
                <Link href="/membership">NÂNG CẤP NGAY</Link>
              </Button>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto p-4 lg:p-10 flex flex-col items-center">
              {selectedChapter.type === "pdf" ? (
                <div className="w-full aspect-[4/5] bg-background border rounded-lg shadow-xl overflow-hidden">
                  <iframe
                    src={`${selectedChapter.pdfPath}#toolbar=0`}
                    className="w-full h-full border-none"
                    title={selectedChapter.label}
                  />
                </div>
              ) : (
                <div className="relative group bg-white dark:bg-zinc-900 border rounded-2xl shadow-2xl p-1 overflow-hidden transition-all duration-300">
                  <Zoom>
                    <img
                      src={`/khang-sinh/${encodeURIComponent(selectedChapter.folder)}/${currentPage + 1}.jpg`}
                      alt={`${selectedChapter.label} p${currentPage + 1}`}
                      className="w-full h-auto max-h-[1600px] object-contain rounded-xl"
                    />
                  </Zoom>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Trang {currentPage + 1}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hard-Fixed Footer Slides */}
        {selectedChapter.type === "images" && isVip && (
          <div className="absolute bottom-0 left-0 right-0 h-32 border-t bg-background/95 backdrop-blur-md z-40 flex flex-col shadow-[0_-8px_32px_rgba(0,0,0,0.1)]">
            <div className="px-6 py-2 border-b flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/5">
              <div className="flex items-center gap-4">
                <span className="text-foreground">{selectedChapter.label}</span>
                <span className="text-primary opacity-30">|</span>
                <span className="text-primary font-black">
                  P.{currentPage + 1} / {selectedChapter.count}
                </span>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleNextPage}
                  disabled={currentPage === selectedChapter.count - 1}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center gap-4 px-6 no-scrollbar h-full">
              {Array.from({ length: selectedChapter.count }).map((_, i) => (
                <button
                  key={i}
                  id={`thumb-${i}`}
                  onClick={() => {
                    setCurrentPage(i);
                  }}
                  className={cn(
                    "relative h-16 w-12 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all duration-200 transform",
                    currentPage === i
                      ? "border-primary scale-110 shadow-lg shadow-primary/30 z-10 -translate-y-1"
                      : "border-border/40 opacity-40 hover:opacity-100 hover:scale-[1.05]",
                  )}
                >
                  <img
                    src={`/khang-sinh/${encodeURIComponent(selectedChapter.folder)}/${i + 1}.jpg`}
                    alt={`Thumb ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 inset-x-0 h-4 flex items-center justify-center text-[9px] font-black leading-none",
                      currentPage === i
                        ? "bg-primary text-white"
                        : "bg-black/80 text-white",
                    )}
                  >
                    {i + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        .custom-grid-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-grid-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-grid-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.1);
          border-radius: 10px;
        }
        .custom-grid-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.2);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
