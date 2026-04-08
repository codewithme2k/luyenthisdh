import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Course() {
  return (
    <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          Khoá Học Chuyên Sâu
        </h2>
        <Link
          href="/courses"
          className="px-6 py-2 bg-white dark:bg-slate-800 rounded-full text-xs font-bold shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white transition-all"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="group relative bg-white dark:bg-slate-900 rounded-[3rem] p-4 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500"
          >
            <div className="relative h-60 rounded-[2.5rem] overflow-hidden">
              <Image
                src={`https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=20&w=400&auto=format&fit=crop`}
                alt="Course"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white">
                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600 px-3 py-1 rounded-full">
                  New
                </span>
                <div className="flex items-center gap-1 font-bold text-sm">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />{" "}
                  4.9
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                Tim mạch can thiệp: Từ cơ bản đến nâng cao
              </h3>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <span className="text-2xl font-black text-blue-600">890k</span>
                <Button className="rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase h-10 px-6">
                  Học Ngay
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
