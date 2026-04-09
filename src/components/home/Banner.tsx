"use client";

import React from "react";
import { Button } from "../ui/button";
import { Users, BookOpen, Activity, ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const SLIDES = [
  {
    badge: "Platform Học Tập Y Khoa Thế Hệ Mới",
    title: "Nâng Tầm Lâm Sàng Y Khoa Việt Nam",
    description:
      "Hệ thống bài giảng chuyên sâu, Case lâm sàng thực tế và thư viện chẩn đoán hình ảnh dành riêng cho Bác sĩ.",
    image: "/static/images/banners/hero-doctor.jpg",
    stats: "2.5k+",
    statsLabel: "Bác sĩ đồng hành",
    icon: <Users size={24} />,
    color: "from-blue-600 to-indigo-500",
  },
  {
    badge: "Thư viện Case lâm sàng",
    title: "Phân Tích Ca Bệnh Cùng Chuyên Gia",
    description:
      "Tiếp cận hàng ngàn ca bệnh thực tế tại các bệnh viện tuyến đầu, có lời giải và phân tích chi tiết.",
    image: "/static/images/banners/hero-doctor.jpg",
    stats: "500+",
    statsLabel: "Ca bệnh thực tế",
    icon: <Activity size={24} />,
    color: "from-emerald-600 to-teal-500",
  },
  {
    badge: "Luyện thi Sau đại học",
    title: "Chinh Phục Kỳ Thi Chuyên Khoa I",
    description:
      "Ngân hàng câu hỏi trắc nghiệm bám sát đề thi từ ĐH Y Dược và ĐH Y Hà Nội.",
    image: "/static/images/banners/hero-doctor.jpg",
    stats: "10k+",
    statsLabel: "Câu hỏi trắc nghiệm",
    icon: <BookOpen size={24} />,
    color: "from-orange-600 to-red-500",
  },
];

export default function BannerCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true }),
  );

  return (
    <section className="relative overflow-hidden pt-6">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {SLIDES.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 border border-slate-200 dark:border-slate-800 relative overflow-hidden group mx-1">
                {/* Background Glow Effect - Tinh chỉnh nhẹ để nổi trên nền phẳng */}
                <div
                  className={`absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700`}
                ></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[2px]">
                      {slide.badge}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter font-heading">
                      {" "}
                      {/* Thêm font-serif để tên to rõ hơn */}
                      {slide.title.split(" ").map((word, i) =>
                        word === "Lâm" ||
                        word === "Sàng" ||
                        word === "Ca" ||
                        word === "Bệnh" ||
                        word === "Chuyên" ||
                        word === "Khoa" ? (
                          <span
                            key={i}
                            className={`text-transparent bg-clip-text bg-linear-to-r ${slide.color}`}
                          >
                            {" "}
                            {word}{" "}
                          </span>
                        ) : (
                          ` ${word} `
                        ),
                      )}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {/* Bỏ shadow-lg shadow-blue-500/20 */}
                      <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 h-14 font-black active:scale-95 transition-all uppercase text-xs tracking-widest gap-2"
                      >
                        Vào Học Ngay <ChevronRight size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-2xl px-8 h-14 font-bold border-slate-200 dark:border-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Tìm Hiểu Thêm
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    {/* Bỏ shadow-2xl, giữ nguyên rounded và border */}
                    <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
                    </div>

                    {/* Floating Badge - Bỏ shadow-2xl, giữ nguyên rounded và border */}
                    <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                        {slide.icon}
                      </div>
                      <div>
                        <p className="text-2xl font-black dark:text-white">
                          {slide.stats}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {slide.statsLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons (Ẩn trên mobile) */}
        <div className="hidden md:block">
          {/* Sửa lại class để nút navigation không có bóng */}
          <CarouselPrevious className="left-6 bg-amber-400 dark:bg-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-background rounded-full w-12 h-12" />
          <CarouselNext className="right-6 bg-amber-400 dark:bg-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-backgound rounded-full w-12 h-12" />
        </div>
      </Carousel>
    </section>
  );
}
