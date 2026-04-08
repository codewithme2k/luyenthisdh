"use client";

import React, { useState, useEffect, useRef } from "react";
import { allTools } from "contentlayer/generated";
import { ToolCard } from "@/components/customs/cards/tool";
import { PageHeader } from "@/components/customs/page-header";
import { allCoreContent } from "@/utils/contentlayer";
import { sortPosts } from "@/utils/misc";
import { Container } from "@/components/customs/Container";
import { Search, ChevronRight } from "lucide-react";

export default function Tools() {
  const allCoreTools = allCoreContent(sortPosts(allTools));
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Lọc danh sách gợi ý dựa trên nội dung đang gõ
  const suggestions = allCoreTools
    .filter((tool) => {
      const isMatch = tool.title
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      return isMatch && searchValue.length > 0;
    })
    .slice(0, 5); // Chỉ hiện tối đa 5 gợi ý cho gọn

  // 2. Đóng gợi ý khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Logic lọc kết quả chính (như cũ)
  const filteredTools = allCoreTools.filter((tool) => {
    const searchContent = (
      tool.title +
      tool.summary +
      (tool.tags?.join(" ") || "")
    ).toLowerCase();
    return searchContent.includes(searchValue.toLowerCase());
  });

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Tools & Snippets"
        description="Tra cứu nhanh các công cụ y khoa và mã nguồn."
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-10">
        <div className="relative max-w-2xl mb-12" ref={dropdownRef}>
          <div className="relative group">
            <input
              type="text"
              value={searchValue}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Gõ để tìm nhanh (eGFR, slug, v.v...)"
              className="block w-full px-5 py-4 pl-14 text-gray-900 bg-white border border-gray-200 rounded-[2rem] dark:border-cyan-700 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 dark:bg-background dark:text-slate-100 outline-none transition-all shadow-sm"
            />
            <Search className="absolute left-5 top-4 text-gray-400 group-focus-within:text-cyan-600 transition-colors h-6 w-6" />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-background border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-2">
                {suggestions.map((tool) => (
                  <button
                    key={tool.path}
                    onClick={() => {
                      setSearchValue(tool.title);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-2xl transition-colors group"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-cyan-600">
                        {tool.title}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {tool.tags?.[0] || "Tool"}
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 group-hover:text-cyan-500"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Danh sách ToolCard hiển thị bên dưới */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {filteredTools.map((tool) => (
            <ToolCard tool={tool} key={tool.path} />
          ))}
        </div>
      </div>
    </Container>
  );
}
