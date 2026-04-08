"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Tag,
  X,
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
  slug: string;
  subjectId: string;
  image: string;
  price: number;
  salePrice: number;
  level: string;
  label: string;
}

interface Props {
  initialData: Course[];
  subjects: Subject[];
}

const ITEMS_PER_PAGE = 8;

export default function ArticleList({ initialData, subjects }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Logic lọc dữ liệu
  const filteredData = useMemo(() => {
    return initialData.filter((course) => {
      const matchesSearch = course.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || course.subjectId === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [searchTerm, selectedSubject, initialData]);

  // 2. Logic phân trang
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* --- PHẦN BỘ LỌC & SEARCH (Gọn gàng) --- */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            placeholder="Tìm kiếm khoá học..."
            className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 py-2 pl-10 pr-10 rounded-xl text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>

        {/* Chuyên khoa Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mr-1">
            <Tag size={12} /> Chuyên khoa:
          </span>
          <button
            onClick={() => {
              setSelectedSubject("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
              selectedSubject === "all"
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-500"
            }`}
          >
            Tất cả
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                selectedSubject === sub.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-500"
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* --- GRID DANH SÁCH (4 cột gọn gàng) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentData.length > 0 ? (
          currentData.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                <Image
                  src={course.image || "/exam-default.png"}
                  alt={course.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-[9px] font-black text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {course.label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 mb-2 text-blue-600 uppercase text-[9px] font-black tracking-[1.5px]">
                  <GraduationCap size={12} />
                  {course.level}
                </div>

                <h3 className="font-bold text-[13px] text-gray-800 dark:text-gray-100 mb-4 line-clamp-2 leading-snug min-h-[36px] group-hover:text-blue-600 transition-colors">
                  {course.name}
                </h3>

                <div className="mt-auto pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-900 dark:text-white leading-none">
                      {course.salePrice > 0
                        ? `${course.salePrice.toLocaleString()}đ`
                        : "Free"}
                    </span>
                    {course.price > course.salePrice && (
                      <span className="text-[10px] text-gray-400 line-through mt-1">
                        {course.price.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Xem <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <p className="text-sm text-gray-400">
              Không tìm thấy khoá học nào.
            </p>
          </div>
        )}
      </div>

      {/* --- PHÂN TRANG (Kích thước nhỏ) --- */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 disabled:opacity-20 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 disabled:opacity-20 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
