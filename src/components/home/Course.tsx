"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/generated/prisma";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function CourseSlide({ courses }: { courses: Course[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 lg:px-14">
        <div className="flex flex-col md:flex-row justify-between items-center mb-14 gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              KHOÁ HỌC CHUYÊN SÂU
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Nâng tầm kỹ năng với các chuyên gia hàng đầu
            </p>
          </div>
          <Link
            href="/courses"
            className="group flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-900 rounded-full text-sm font-bold shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            Xem tất cả
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-4 md:-ml-6 py-6 px-2">
            {courses?.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="group relative bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200/60 dark:border-slate-800/80 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">

                  <div className="relative h-56 shrink-0 rounded-2xl overflow-hidden">
                    <Image
                      src={item.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=20&w=400&auto=format&fit=crop"}
                      alt={item.name || "Course"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80"></div>

                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                        Mới
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm text-sm font-bold text-slate-800 dark:text-slate-100">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span>{item.rating_avg || 4.9}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-5">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                        Cập nhật xu hướng mới nhất
                      </p>
                    </div>


                    <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        {item.price
                          ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.price)
                          : "Miễn phí"}
                      </span>
                      <Button
                        asChild
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/20"
                      >

                        <Link href={`/courses/${item.slug}`}>
                          Học Ngay
                        </Link>
                      </Button>
                    </div>
                  </div>

                </div>
              </CarouselItem>
            ))}
          </CarouselContent>


          <div className="hidden lg:block">
            <CarouselPrevious className="left-[-3.5rem] w-12 h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800" />
            <CarouselNext className="right-[-3.5rem] w-12 h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}