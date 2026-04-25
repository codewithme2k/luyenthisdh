"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  RotateCcw,
  PlayCircle,
  Lock,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Crown,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson, Lecture } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LectureWithLessons extends Lecture {
  Lessons: Lesson[];
}

interface Props {
  lesson: Lesson & {
    lecture: Lecture & {
      course: {
        slug: string;
        name: string;
        Lectures: LectureWithLessons[];
      };
    };
  };
  isVipServer: boolean;
  planName: string | null;
}

export default function LessonViewClient({
  lesson,
  isVipServer,
  planName,
}: Props) {
  const router = useRouter();
  // Mặc định mở sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openLectures, setOpenLectures] = useState<string[]>([
    lesson.lectureId,
  ]);

  // Tự động đóng trên các thiết bị nhỏ khi mount
  useEffect(() => {
    if (window.innerWidth < 1024) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSidebarOpen(false);
    }
  }, []);

  const lectures = lesson.lecture.course.Lectures;

  const toggleLecture = (id: string) => {
    setOpenLectures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const renderContent = () => {
    if (!lesson.isFree && !isVipServer) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 p-10 text-center">
          <Lock size={60} className="text-slate-400 dark:text-slate-600" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white text-slate-800">
              Nội dung VIP
            </h3>
            <p className="text-slate-500 text-sm">
              Vui lòng nâng cấp để xem tài liệu này.
            </p>
          </div>
          <Button
            onClick={() => router.push("/membership")}
            className="bg-blue-600 rounded-full"
          >
            Nâng cấp ngay
          </Button>
        </div>
      );
    }

    if (!lesson.iframe)
      return <div className="text-slate-500">Đang tải...</div>;

    const safeIframe = lesson.iframe
      .replace("/view", "/preview")
      .replace(/width="[0-9]+"/, 'width="100%"')
      .replace(/height="[0-9]+"/, 'height="100%"');

    return (
      <div
        className="w-full h-full bg-black shadow-2xl"
        dangerouslySetInnerHTML={{ __html: safeIframe }}
      />
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] dark:bg-[#020617] overflow-hidden select-none transition-colors duration-300">
      {/* --- HEADER --- */}
      <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

          <Link href={`/courses/${lesson.lecture?.course?.slug}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 dark:text-slate-400 p-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="max-w-[150px] sm:max-w-md">
            <h1 className="text-slate-900 dark:text-white font-bold text-sm md:text-base truncate uppercase tracking-tight">
              {lesson.title}
            </h1>
            {isVipServer && (
              <span className="text-[9px] text-amber-500 dark:text-yellow-400 font-bold flex items-center gap-1 uppercase">
                <Crown size={10} className="fill-current" /> {planName || "VIP"}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="h-8 text-[10px] font-bold px-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          onClick={() => window.location.reload()}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-2" /> Tải lại
        </Button>
      </header>

      {/* --- MAIN BODY --- */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* NỘI DUNG CHÍNH - TỰ ĐỘNG FULL KHI SIDEBAR ĐÓNG NHỜ flex-1 */}
        <main className="flex-1 bg-slate-200 dark:bg-black relative flex items-center justify-center transition-all duration-300 overflow-hidden">
          {renderContent()}
        </main>

        {/* SIDEBAR - Sẽ biến mất hoàn toàn khi isSidebarOpen = false */}
        {isSidebarOpen && (
          <aside className="w-[300px] lg:w-[350px] bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest text-left">
                Nội dung học tập
              </h2>
              {!isVipServer && (
                <Link
                  href="/membership"
                  className="text-[9px] bg-amber-500 text-white px-2 py-0.5 rounded font-bold"
                >
                  VIP
                </Link>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar dark:custom-scrollbar-dark p-2">
              {lectures?.map((lect, idx) => (
                <div key={lect.id} className="mb-2">
                  <button
                    onClick={() => toggleLecture(lect.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      openLectures.includes(lect.id)
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-[9px] font-bold opacity-50 uppercase">
                        Chương {idx + 1}
                      </p>
                      <p className="text-xs font-bold truncate max-w-[200px]">
                        {lect.title}
                      </p>
                    </div>
                    {openLectures.includes(lect.id) ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>

                  {openLectures.includes(lect.id) && (
                    <div className="mt-1 space-y-1">
                      {lect.Lessons?.map((les) => {
                        const canAccess = les.isFree || isVipServer;
                        const isActive = les.slug === lesson.slug;
                        return (
                          <div
                            key={les.id}
                            onClick={() =>
                              canAccess
                                ? router.push(
                                    `/courses/${lesson.lecture.course.slug}/lesson/${les.slug}`,
                                  )
                                : toast.error("Cần đăng nhập và mua gói thành viên để xem khoá học")
                            }
                            className={`flex items-center gap-3 p-3 px-5 mx-1 rounded-xl cursor-pointer transition-all ${
                              isActive
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                            } ${!canAccess && "opacity-30 grayscale cursor-not-allowed"}`}
                          >
                            <div
                              className={`p-1 rounded-lg ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"}`}
                            >
                              {canAccess ? (
                                <PlayCircle size={14} />
                              ) : (
                                <Lock size={14} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold line-clamp-1">
                                {les.title}
                              </span>
                              {les.isFree && !isVipServer && (
                                <span className="text-[8px] text-emerald-500 font-bold uppercase mt-1">
                                  Học thử
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-white dark:bg-[#0f172a] py-1 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
        <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
          YKHOASO &copy; 2026 • LÂM SÀNG THỰC CHIẾN
        </p>
      </footer>
    </div>
  );
}
