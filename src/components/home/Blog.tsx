"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, Code, FileText } from "lucide-react";
import { clsx } from "clsx";
import { CoreContent } from "@/shared/types/data";
import { Blog, Tool } from "contentlayer/generated";
import { formatDate } from "@/utils/misc";

import { Brand, BrandsMap } from "@/components/customs/brand";
import { GradientBorder } from "@/components/customs/gradient-border";
import { GrowingUnderline } from "@/components/customs/growing-underline";
import { TiltedGridBackground } from "@/components/customs/tilted-grid-background";

export default function BlogSection({
  posts,
  tools,
}: {
  posts: CoreContent<Blog>[];
  tools: CoreContent<Tool>[];
}) {
  const [activeTab, setActiveTab] = useState<"posts" | "tools">("posts");

  return (
    <section className="py-20 bg-[#f1f5f9] dark:bg-slate-950 px-4">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER & TABS --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic">
            Latest <span className="text-blue-600">Updates</span>
          </h2>

          <div className="flex p-1.5 bg-slate-200 dark:bg-white/5 backdrop-blur-md rounded-2xl w-fit border border-slate-300 dark:border-white/10">
            <button
              onClick={() => setActiveTab("posts")}
              className={clsx(
                "flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-black transition-all",
                activeTab === "posts"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
              )}
            >
              <FileText size={18} /> POSTS
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={clsx(
                "flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-black transition-all",
                activeTab === "tools"
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
              )}
            >
              <Code size={18} /> TOOLS
            </button>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="min-h-[450px]">
          {activeTab === "posts" ? (
            /* HIỂN THỊ POSTS (HÀNG NGANG) */
            <div className="flex flex-col gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col md:flex-row gap-8 bg-white dark:bg-white/5 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative w-full md:w-80 h-52 shrink-0 rounded-[2rem] overflow-hidden">
                    <Image
                      src={post.images?.[0] || "/static/images/fallback.png"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex flex-col justify-center space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                        {post.tags?.[0] || "Medical"}
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1 uppercase">
                        <Calendar size={12} /> {formatDate(post.date)}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                      {post.summary}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest pt-2">
                      Đọc chi tiết{" "}
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 pt-10">
              {tools.map((tool) => (
                <GradientBorder key={tool.slug} className="rounded-2xl">
                  <Link
                    href={`/${tool.path}`}
                    title={tool.title}
                    className={clsx(
                      "relative flex h-full rounded-2xl p-1",
                      "bg-white dark:bg-zinc-900/50",
                      "transition-shadow hover:shadow-xl",
                      "hover:shadow-blue-500/5 dark:hover:shadow-black/20",
                    )}
                  >
                    <TiltedGridBackground className="inset-0 opacity-20" />

                    {/* Brand Icon floating on top */}
                    <Brand
                      name={tool.icon as keyof typeof BrandsMap}
                      as="icon"
                      className="absolute -top-6 left-6 z-10 h-12 w-12 text-gray-900 dark:text-white drop-shadow-md"
                    />

                    <div className="relative w-full px-6 pt-10 pb-8">
                      <h3 className="text-xl leading-7 font-bold dark:text-white">
                        <GrowingUnderline>{tool.title}</GrowingUnderline>
                      </h3>
                      <p className="mt-3 line-clamp-2 text-slate-500 dark:text-zinc-400 text-sm font-medium">
                        {tool.summary}
                      </p>
                    </div>
                  </Link>
                </GradientBorder>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
