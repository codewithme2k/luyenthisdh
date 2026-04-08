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
  CheckCircle2,
  Calendar,
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
    <div className="bg-[#f8fafc] dark:bg-[#020617] min-h-screen pb-20 select-none transition-colors duration-500">
      {/* --- HERO SECTION --- */}
      <div className="relative bg-slate-900 dark:bg-[#020617] pt-24 pb-32 overflow-hidden border-b border-slate-800">
        {/* Animated Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[10%] -right-[5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 dark:from-[#020617] to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="lg:w-2/3 space-y-8">
            {isVipServer && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-500 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[2px] border border-amber-500/30 backdrop-blur-xl shadow-lg shadow-amber-500/10">
                <ShieldCheck size={14} className="animate-bounce" />
                Premium VIP Access
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-sm">
              {course.name}
            </h1>

            <p className="text-slate-400 dark:text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
              {course.description ||
                "Khóa học chuyên sâu được thiết kế bài bản để giúp bạn làm chủ kiến thức lâm sàng và thực hành."}
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                {
                  icon: Star,
                  text: `${course.rating[0] || 5.0} Đánh giá`,
                  color: "text-yellow-400",
                },
                {
                  icon: Users,
                  text: `${course.views.toLocaleString()} Học viên`,
                  color: "text-blue-400",
                },
                {
                  icon: BarChart,
                  text: `Cấp độ: ${course.level}`,
                  color: "text-emerald-400",
                },
                {
                  icon: Calendar,
                  text: `Cập nhật: 2026`,
                  color: "text-indigo-400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl backdrop-blur-md text-white text-sm font-bold transition-all hover:bg-white/10"
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className=" mx-auto -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Syllabus Card */}
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl pt-8 rounded-[3rem] border border-white dark:border-slate-800 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-12 pb-6 px-6 border-b border-slate-50 dark:border-slate-800/50">
                <div className="mx-auto">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">
                    Cấu trúc khóa học
                  </h2>
                  <p className="text-sm text-slate-400 font-medium">
                    Tìm hiểu lộ trình học tập chuyên sâu của bạn
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">
                    {course.Lectures?.reduce(
                      (acc, curr) => acc + (curr.Lessons?.length || 0),
                      0,
                    )}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                    Bài giảng
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {course.Lectures?.map(
                  (lecture: LectureWithLessons, index: number) => (
                    <div
                      key={lecture.id}
                      className="rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 transition-all hover:shadow-lg"
                    >
                      <button
                        onClick={() => toggleLecture(lecture.id)}
                        className="w-full flex items-center justify-between py-6 md:p-6 text-left group transition-colors"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-black text-xl italic group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {(index + 1).toString().padStart(2, "0")}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors tracking-tight">
                              {lecture.title}
                            </h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {lecture.Lessons?.length} bài học
                            </span>
                          </div>
                        </div>
                        {openLectures.includes(lecture.id) ? (
                          <ChevronUp className="w-5 h-5 text-blue-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      {openLectures.includes(lecture.id) && (
                        <div className="pb-4 px-4">
                          <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl overflow-hidden divide-y dark:divide-slate-800">
                            {lecture.Lessons?.map((lesson) => {
                              const canAccess = lesson.isFree || isVipServer;
                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => handleLessonClick(lesson)}
                                  className={`flex items-center justify-between p-4 px-6 group/item transition-all ${
                                    canAccess
                                      ? "hover:bg-white dark:hover:bg-slate-800 cursor-pointer shadow-sm"
                                      : "opacity-50 cursor-not-allowed"
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    {canAccess ? (
                                      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 animate-pulse">
                                        <PlayCircle size={18} />
                                      </div>
                                    ) : (
                                      <div className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500">
                                        <Lock size={18} />
                                      </div>
                                    )}
                                    <div className="flex flex-col">
                                      <span
                                        className={`text-sm font-bold ${canAccess ? "text-slate-700 dark:text-slate-200" : "text-slate-500"}`}
                                      >
                                        {lesson.title}
                                      </span>
                                      {lesson.isFree && !isVipServer && (
                                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[2px] mt-0.5">
                                          Học thử free
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-mono font-bold text-slate-400 tracking-tighter">
                                      {Math.floor(lesson.duration / 60)}:
                                      {(lesson.duration % 60)
                                        .toString()
                                        .padStart(2, "0")}
                                    </span>
                                    {canAccess && (
                                      <ExternalLink
                                        size={14}
                                        className="text-blue-500 opacity-0 group-hover/item:opacity-100 transition-all"
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 lg:relative">
            <div className="sticky top-10 space-y-6">
              {/* Main Pricing Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl dark:shadow-none overflow-hidden group/card">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={course.image || "/exam-default.png"}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-500 cursor-pointer">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center">
                      <PlayCircle className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-end gap-3 mb-8">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                      {course.salePrice > 0
                        ? `${course.salePrice.toLocaleString()}đ`
                        : "MIỄN PHÍ"}
                    </span>
                    {course.price > course.salePrice && (
                      <span className="text-sm text-slate-400 line-through font-bold mb-1">
                        {course.price.toLocaleString()}đ
                      </span>
                    )}
                  </div>

                  {!isVipServer ? (
                    <button
                      onClick={() => router.push("/membership")}
                      className="w-full relative py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-[0_15px_30px_-10px_rgba(37,99,235,0.4)]"
                    >
                      {course.cta || "Tham gia khóa học ngay"}
                    </button>
                  ) : (
                    <div className="w-full py-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-center flex items-center justify-center gap-3">
                      <CheckCircle2 size={24} /> Khóa học đã mở khóa
                    </div>
                  )}

                  <div className="mt-8 space-y-4 pt-8 border-t border-slate-50 dark:border-slate-800">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-4">
                      Đặc quyền dành cho bạn
                    </h4>
                    {[
                      { icon: Clock, text: "Truy cập không giới hạn trọn đời" },
                      {
                        icon: ShieldCheck,
                        text: "Nội dung cập nhật theo năm 2026",
                      },
                      { icon: Users, text: "Group hỗ trợ học viên 24/7" },
                      {
                        icon: PlayCircle,
                        text: "Học trên mọi thiết bị (Mobile/Web)",
                      },
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-500">
                          <feature.icon size={16} />
                        </div>
                        {feature.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Support Info Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
                <h4 className="font-black text-lg mb-2 leading-tight">
                  Cần hỗ trợ tư vấn?
                </h4>
                <p className="text-blue-100 text-xs font-medium mb-6 opacity-80">
                  Nếu bạn cần tư vấn lộ trình học ôn thi Sau đại học chuyên sâu,
                  đừng ngần ngại liên hệ.
                </p>
                <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors">
                  Chat với Bác sĩ Hữu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
