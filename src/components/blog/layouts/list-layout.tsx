"use client";

import type { Blog } from "contentlayer/generated";
import { ArrowLeft, ArrowRight, Tag, X, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { PostCardGridView } from "@/components/blog/post-card-grid-view";
import { SearchArticles } from "@/components/blog/search-articles";
import { GrowingUnderline } from "@/components/customs/growing-underline";
import type { CoreContent } from "@/shared/types/data";
import Link from "next/link";
import { Container } from "@/components/customs/Container";
import { PageHeader } from "@/components/customs/page-header";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[];
  title: string;
  initialDisplayPosts?: CoreContent<Blog>[];
  pagination?: PaginationProps;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between items-center">
        {prevPage ? (
          <Link
            className="cursor-pointer"
            href={
              currentPage - 1 === 1
                ? `/${basePath}/`
                : `/${basePath}/page/${currentPage - 1}`
            }
            rel="prev"
          >
            <GrowingUnderline className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
              <ArrowLeft className="h-4 w-4" />
              <span>Trang trước</span>
            </GrowingUnderline>
          </Link>
        ) : (
          <div className="opacity-30 cursor-not-allowed">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft className="h-4 w-4" />
              <span>Trang trước</span>
            </div>
          </div>
        )}

        <span className="text-xs font-black font-mono bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {currentPage} / {totalPages}
        </span>

        {nextPage ? (
          <Link
            className="cursor-pointer"
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
          >
            <GrowingUnderline className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
              <span>Trang sau</span>
              <ArrowRight className="h-4 w-4" />
            </GrowingUnderline>
          </Link>
        ) : (
          <div className="opacity-30 cursor-not-allowed">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <span>Trang sau</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState("");

  const searchSuggestions = useMemo(() => {
    if (!searchValue) return [];
    return posts
      .filter((p) => p.title.toLowerCase().includes(searchValue.toLowerCase()))
      .map((p) => p.title)
      .slice(0, 5);
  }, [searchValue, posts]);
  const commonTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => post.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort().slice(0, 7);
  }, [posts]);

  const filteredBlogPosts = useMemo(() => {
    return posts.filter((post) => {
      const searchContent = (
        post.title +
        post.summary +
        (post.tags?.join(" ") || "")
      ).toLowerCase();
      return searchContent.includes(searchValue.toLowerCase());
    });
  }, [searchValue, posts]);

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue
      ? initialDisplayPosts
      : filteredBlogPosts;

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title={title}
        description="Ghi chép về lập trình, y khoa lâm sàng và những trải nghiệm cá nhân của Bác sĩ Hữu."
        className="border-b border-gray-200 dark:border-gray-700"
      >
        <div className="mt-6 space-y-5">
          {/* Search Box */}
          <div className="relative group max-w-xl">
            <SearchArticles
              label="Tìm kiếm bài viết..."
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              suggestions={searchSuggestions}
              onSuggestionClick={(val) => setSearchValue(val)}
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-400 hover:text-cyan-500" />
              </button>
            )}
          </div>

          {/* Tag Suggestions */}
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 flex items-center gap-1.5 mr-2">
              <Tag size={12} /> Gợi ý:
            </span>
            {commonTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchValue(tag)}
                className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all active:scale-95 ${
                  searchValue.toLowerCase() === tag.toLowerCase()
                    ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-cyan-500 hover:text-cyan-500"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      {/* Results Section */}
      {!filteredBlogPosts.length ? (
        <div className="py-24 text-center">
          <div className="bg-gray-50 dark:bg-slate-900/50 inline-flex p-6 rounded-[2.5rem] mb-4 border border-dashed border-gray-200 dark:border-gray-800">
            <Search size={40} className="text-gray-300 dark:text-gray-700" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Không tìm thấy bài viết nào cho từ khóa{" "}
            <span className="text-cyan-500 font-bold">
              &quot;{searchValue}&quot;
            </span>
          </p>
          <button
            onClick={() => setSearchValue("")}
            className="mt-4 text-xs font-black uppercase tracking-widest text-cyan-600 hover:underline"
          >
            Xem tất cả bài viết
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 py-10 md:gap-y-16 lg:grid-cols-2 xl:grid-cols-3">
          {displayPosts.map((post) => (
            <PostCardGridView key={post.path} post={post} />
          ))}
        </div>
      )}

      {/* Phân trang - Chỉ hiện khi không search */}
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      )}
    </Container>
  );
}
