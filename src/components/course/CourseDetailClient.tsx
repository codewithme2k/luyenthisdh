"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  PlayCircle,
  Star,
  Users,
  BarChart,
  ChevronDown,
  ChevronUp,
  Lock,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Lesson } from "@/generated/prisma/client";
import { CourseFullDetails, LectureWithLessons } from "@/shared/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  course: CourseFullDetails;
  isVipServer: boolean;
}

export default function CourseDetailClient({ course, isVipServer }: Props) {
  const router = useRouter();

  // Mở mặc định chương đầu tiên
  const [openLectures, setOpenLectures] = useState<string[]>([
    course.Lectures[0]?.id,
  ]);

  const toggleLecture = (id: string) => {
    setOpenLectures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isFree || isVipServer) {
      window.open(`/course/${course.slug}/lesson/${lesson.slug}`, "_blank");
    } else {
      toast.error("Nội dung giới hạn", {
        description: "Vui lòng nâng cấp VIP để xem toàn bộ bài học này.",
        action: {
          label: "Nâng cấp ngay",
          onClick: () => router.push("/membership"),
        },
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] min-h-screen pb-20 select-none transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white py-20 relative overflow-hidden">
        {/* Hiệu ứng decor nền cho Dark Mode */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-600 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          <div className="lg:col-span-2 space-y-6">
            {isVipServer && (
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-500 dark:text-yellow-400 px-4 py-1.5 rounded-full text-xs font-bold border border-yellow-500/30 uppercase tracking-widest backdrop-blur-md">
                <ShieldCheck size={14} className="animate-pulse" /> Bạn đang có
                quyền truy cập VIP
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              {course.name}
            </h1>
            <p className="text-slate-400 dark:text-slate-300 text-lg max-w-2xl leading-relaxed">
              {course.description ||
                "Khóa học chuyên sâu giúp bạn làm chủ kiến thức từ nền tảng đến thực chiến."}
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold pt-4">
              <div className="flex items-center gap-2 bg-white/5 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-white/10 dark:border-slate-700/50 backdrop-blur-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{course.rating[0] || 5.0} Đánh giá</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-white/10 dark:border-slate-700/50 backdrop-blur-sm">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{course.views.toLocaleString()} Học viên</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-white/10 dark:border-slate-700/50 backdrop-blur-sm">
                <BarChart className="w-4 h-4 text-green-400" />
                <span>Cấp độ: {course.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-20">
        {/* Nội dung bên trái */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                Nội dung bài học
              </h2>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-2 rounded-full uppercase tracking-wider">
                {course.Lectures?.length} chương •{" "}
                {course.Lectures?.reduce(
                  (acc, curr) => acc + (curr.Lessons?.length || 0),
                  0,
                )}{" "}
                bài học
              </span>
            </div>

            <div className="space-y-5">
              {course.Lectures?.map(
                (lecture: LectureWithLessons, index: number) => (
                  <div
                    key={lecture.id}
                    className="group overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleLecture(lecture.id)}
                      className="w-full flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-5 text-left">
                        <span className="text-slate-400 dark:text-slate-600 font-black text-xl italic group-hover:text-blue-500 transition-colors">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">
                          {lecture.title}
                        </h3>
                      </div>
                      {openLectures.includes(lecture.id) ? (
                        <ChevronUp className="w-5 h-5 text-blue-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {openLectures.includes(lecture.id) && (
                      <div className="bg-white dark:bg-slate-900/50 divide-y dark:divide-slate-800">
                        {lecture.Lessons?.map((lesson) => {
                          const canAccess = lesson.isFree || isVipServer;
                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleLessonClick(lesson)}
                              className={`flex items-center justify-between p-5 px-8 group/item transition-all ${
                                canAccess
                                  ? "hover:bg-blue-50/50 dark:hover:bg-blue-500/5 cursor-pointer"
                                  : "opacity-50 cursor-not-allowed grayscale-[0.5]"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`p-2 rounded-xl transition-colors ${canAccess ? "bg-blue-50 dark:bg-blue-500/10 text-blue-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                                >
                                  {canAccess ? (
                                    <PlayCircle
                                      size={20}
                                      className="group-hover/item:scale-110 transition-transform"
                                    />
                                  ) : (
                                    <Lock size={20} />
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span
                                    className={`text-sm font-bold tracking-tight ${canAccess ? "text-slate-700 dark:text-slate-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400" : "text-slate-500 dark:text-slate-600"}`}
                                  >
                                    {lesson.title}
                                  </span>
                                  {lesson.isFree && !isVipServer && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mt-1">
                                      Học thử miễn phí
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-slate-400 dark:text-slate-600">
                                <span className="text-xs font-mono font-medium tracking-tighter">
                                  {Math.floor(lesson.duration / 60)}:
                                  {(lesson.duration % 60)
                                    .toString()
                                    .padStart(2, "0")}
                                </span>
                                {canAccess ? (
                                  <ExternalLink
                                    size={16}
                                    className="opacity-0 group-hover/item:opacity-100 text-blue-500 transition-all"
                                  />
                                ) : (
                                  <Lock size={14} />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Sidebar bên phải */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden sticky top-8 group/card">
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src={course.image || "/exam-default.png"}
                alt={course.name}
                fill
                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
              />
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                <PlayCircle className="w-16 h-16 text-white drop-shadow-2xl" />
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-blue-600 dark:text-blue-400">
                    {course.salePrice > 0
                      ? `${course.salePrice.toLocaleString()}đ`
                      : "Miễn phí"}
                  </span>
                  {course.price > course.salePrice && (
                    <span className="text-sm text-slate-400 line-through font-bold">
                      {course.price.toLocaleString()}đ
                    </span>
                  )}
                </div>
                <div className="bg-blue-50 dark:bg-blue-500/10 p-2 rounded-2xl">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
              </div>

              {!isVipServer ? (
                <button
                  onClick={() => router.push("/membership")}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-500/20 dark:shadow-none hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  {course.cta || "Đăng ký học ngay"}
                </button>
              ) : (
                <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-5 rounded-[1.5rem] font-bold text-center flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700">
                  <ShieldCheck size={24} className="text-emerald-500" /> Đã sở
                  hữu khóa học
                </div>
              )}

              <div className="space-y-5 pt-8 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-400 uppercase tracking-[0.2em]">
                  Đặc quyền học tập
                </h4>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-500">
                      <Clock size={18} />
                    </div>
                    <span>Truy cập nội dung trọn đời</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-500">
                      <Users size={18} />
                    </div>
                    <span>Hỗ trợ hỏi đáp 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
