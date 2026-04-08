import {
  GraduationCap,
  MessageSquare,
  Microscope,
  PlayCircle,
} from "lucide-react";

export default function Features() {
  return (
    <section className="py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            icon: PlayCircle,
            label: "Bài giảng Video",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            icon: Microscope,
            label: "Thư viện Case bệnh",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            icon: GraduationCap,
            label: "Đánh giá tiến độ",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            icon: MessageSquare,
            label: "Cộng đồng hỏi đáp",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="group p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer text-center space-y-4"
          >
            <div
              className={`w-14 h-14 ${feature.bg} ${feature.color} mx-auto rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <feature.icon size={28} />
            </div>
            <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-900 dark:text-white">
              {feature.label}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
