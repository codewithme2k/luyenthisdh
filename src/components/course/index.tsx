"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
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

const ITEMS_PER_PAGE = 6;

export default function ArticleList({ initialData, subjects }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Logic Lọc dữ liệu
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

  // 2. Logic Phân trang
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header & Bộ lọc */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            KHOÁ HỌC
          </h1>
          <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Lọc môn học */}
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select
              className="w-full border border-gray-200 p-2.5 pl-10 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-sm font-medium"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tìm kiếm */}
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Bạn muốn học gì hôm nay?"
              className="w-full border border-gray-200 p-2.5 pl-10 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid Danh sách Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentData.length > 0 ? (
          currentData.map((course) => (
            <Link
              key={course.id}
              href={`/course/${course.slug}`}
              className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={course.image || "/exam-default.png"}
                  alt={course.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    {course.label}
                  </span>
                  <span className="bg-white/90 backdrop-blur text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-tighter">
                    Course
                  </span>
                </div>

                <h3 className="font-bold text-xl text-gray-800 mb-4 line-clamp-2 min-h-[56px] group-hover:text-blue-600 transition-colors leading-tight">
                  {course.name}
                </h3>

                <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-gray-900">
                      {course.salePrice > 0
                        ? `${course.salePrice.toLocaleString()}đ`
                        : "Miễn phí"}
                    </span>
                    {course.price > course.salePrice && (
                      <span className="text-gray-400 text-xs line-through font-medium">
                        {course.price.toLocaleString()}đ
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-900 text-white px-6 py-2.5 rounded-2xl font-bold text-sm group-hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-gray-200 group-hover:shadow-blue-200">
                    Chi tiết
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium text-lg">
              Không tìm thấy khoá học nào phù hợp.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("all");
              }}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Xoá bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-3 rounded-2xl border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-20 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100 scale-110"
                    : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-3 rounded-2xl border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-20 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
