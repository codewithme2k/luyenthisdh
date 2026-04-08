import React from "react";
import { Button } from "../ui/button";
import { Users } from "lucide-react";
import Image from "next/image";
export default function Banner() {
  return (
    <div>
      <section className="relative pt-10 pb-20 md:pt-20 overflow-hidden">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
          {/* Background Glow Effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[2px]">
                Platform Học Tập Y Khoa Thế Hệ Mới
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
                Nâng Tầm{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                  Lâm Sàng
                </span>{" "}
                <br />Y Khoa Việt Nam
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-lg">
                Hệ thống bài giảng chuyên sâu, Case lâm sàng thực tế và thư viện
                chẩn đoán hình ảnh dành riêng cho Bác sĩ.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-10 h-14 font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all uppercase text-xs tracking-widest"
                >
                  Vào Học Ngay
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
              <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-2xl">
                <Image
                  src="/hero-doctor.jpg"
                  alt="Hero"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-2xl font-black dark:text-white">2.5k+</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Bác sĩ đồng hành
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
