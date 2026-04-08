"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Mock data: Danh sách các gói để tra cứu giá dựa vào ID trên URL
const plansData = {
  basic: { id: "basic", name: "Gói Cơ bản", price: "Miễn phí", amount: 0 },
  pro: {
    id: "pro",
    name: "Gói Chuyên nghiệp",
    price: "199.000đ",
    amount: 199000,
  },
  enterprise: {
    id: "enterprise",
    name: "Gói Cao cấp",
    price: "499.000đ",
    amount: 499000,
  },
};

export function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan") as keyof typeof plansData | null;

  // Lấy thông tin gói dựa trên URL, mặc định là gói Pro nếu không có tham số
  const selectedPlan =
    planParam && plansData[planParam] ? plansData[planParam] : plansData["pro"];

  const [paymentMethod, setPaymentMethod] = useState("transfer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic thanh toán hoặc lưu vào Database ở đây
    alert(
      `Đang xử lý thanh toán cho ${selectedPlan.name} bằng phương thức: ${paymentMethod}`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
          >
            &larr; Quay lại chọn gói
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
            Thanh toán
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Cột trái: Thông tin khách hàng & Phương thức thanh toán */}
          <div className="lg:col-span-7 space-y-8">
            {/* Thông tin thanh toán */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Thông tin cá nhân
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="0901234567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "transfer" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    Chuyển khoản ngân hàng
                  </span>
                </label>
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    Thẻ tín dụng / Ghi nợ
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedPlan.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Chu kỳ thanh toán: Hàng tháng
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {selectedPlan.price}
                </p>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế VAT (0%)</span>
                  <span>0đ</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-200 mb-6">
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng
                </span>
                <span className="text-2xl font-extrabold text-blue-600">
                  {selectedPlan.price}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                Hoàn tất thanh toán
              </button>

              <p className="mt-4 text-xs text-center text-gray-500">
                Bằng việc bấm &quot;Hoàn tất thanh toán&quot;, bạn đồng ý với
                Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
