"use client";
import React, { useState, useEffect } from "react";

const SOFA2Calculator = () => {
  const [scores, setScores] = useState({
    neuro: 0,
    resp: 0,
    cardio: 0,
    liver: 0,
    renal: 0,
    coag: 0,
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotal(sum);
  }, [scores]);

  const updateScore = (organ: string, value: number) => {
    setScores((prev) => ({ ...prev, [organ]: value }));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg my-8">
      <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400 border-b pb-2 text-center uppercase">
        Tính điểm SOFA-2 (2025)
      </h3>

      <div className="space-y-6">
        {/* THẦN KINH */}
        <section>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            1. Não (GCS hoặc định khu)
          </h4>
          <select
            onChange={(e) => updateScore("neuro", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
          >
            <option value="0">
              GCS 15 / Đáp ứng tốt ký hiệu ngón tay (0đ)
            </option>
            <option value="1">
              GCS 13-14 / Định khu khi đau / Đang dùng thuốc sảng (1đ)
            </option>
            <option value="2">GCS 9-12 / Rút chi khi đau (2đ)</option>
            <option value="3">GCS 6-8 / Gập chi khi đau (3đ)</option>
            <option value="4">GCS 3-5 / Duỗi cứng / Không đáp ứng (4đ)</option>
          </select>
        </section>

        {/* HÔ HẤP */}
        <section>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            2. Hô hấp (PaO₂/FiO₂)
          </h4>
          <select
            onChange={(e) => updateScore("resp", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
          >
            <option value="0">P/F &gt; 300 mmHg (0đ)</option>
            <option value="1">P/F ≤ 300 mmHg (1đ)</option>
            <option value="2">P/F ≤ 225 mmHg (2đ)</option>
            <option value="3">
              P/F ≤ 150 mmHg + Có hỗ trợ hô hấp nâng cao (3đ)
            </option>
            <option value="4">
              P/F ≤ 75 mmHg + Hỗ trợ nâng cao / Đang chạy ECMO (4đ)
            </option>
          </select>
        </section>

        {/* TIM MẠCH */}
        <section>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            3. Tim mạch (Vận mạch Base)
          </h4>
          <select
            onChange={(e) => updateScore("cardio", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
          >
            <option value="0">MAP ≥ 70 mmHg, không cần vận mạch (0đ)</option>
            <option value="1">MAP &lt; 70 mmHg, không cần vận mạch (1đ)</option>
            <option value="2">
              Tổng NA+ADR ≤ 0.2 µg/kg/phút hoặc Inotrope khác (2đ)
            </option>
            <option value="3">
              Tổng NA+ADR &gt; 0.2 đến 0.4 µg/kg/phút (3đ)
            </option>
            <option value="4">
              Tổng NA+ADR &gt; 0.4 µg/kg/phút hoặc hỗ trợ cơ học (4đ)
            </option>
          </select>
        </section>

        {/* GAN */}
        <section>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            4. Gan (Bilirubin)
          </h4>
          <select
            onChange={(e) => updateScore("liver", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
          >
            <option value="0">Bilirubin ≤ 1.2 mg/dL (0đ)</option>
            <option value="1">Bilirubin ≤ 3.0 mg/dL (1đ)</option>
            <option value="2">Bilirubin ≤ 6.0 mg/dL (2đ)</option>
            <option value="3">Bilirubin ≤ 12.0 mg/dL (3đ)</option>
            <option value="4">Bilirubin &gt; 12.0 mg/dL (4đ)</option>
          </select>
        </section>

        {/* ĐÔNG MÁU */}
        <section>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            5. Huyết học (Tiểu cầu)
          </h4>
          <select
            onChange={(e) => updateScore("coag", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
          >
            <option value="0">Tiểu cầu &gt; 150 G/L (0đ)</option>
            <option value="1">Tiểu cầu ≤ 150 G/L (1đ)</option>
            <option value="2">Tiểu cầu ≤ 100 G/L (2đ)</option>
            <option value="3">Tiểu cầu ≤ 80 G/L (3đ)</option>
            <option value="4">Tiểu cầu ≤ 50 G/L (4đ)</option>
          </select>
        </section>

        {/* THẬN */}
        <section>
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
            6. Thận (Creatinin / RRT)
          </h4>
          <select
            onChange={(e) => updateScore("renal", parseInt(e.target.value))}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
          >
            <option value="0">Creatinin ≤ 1.2 mg/dL (0đ)</option>
            <option value="1">
              Creatinin ≤ 2.0 hoặc nước tiểu &lt; 0.5 mL/kg/h (6-12h) (1đ)
            </option>
            <option value="2">
              Creatinin ≤ 3.5 hoặc nước tiểu &lt; 0.5 mL/kg/h (≥12h) (2đ)
            </option>
            <option value="3">
              Creatinin &gt; 3.5 hoặc nước tiểu &lt; 0.3 mL/kg/h (≥24h) (3đ)
            </option>
            <option value="4">
              Đang lọc máu (RRT) hoặc đủ tiêu chuẩn RRT + Toan/K máu (4đ)
            </option>
          </select>
        </section>
      </div>

      <div className="mt-8 p-6 bg-blue-600 rounded-lg text-center shadow-inner">
        <div className="text-white text-lg font-medium">TỔNG ĐIỂM SOFA-2</div>
        <div className="text-5xl font-black text-white mt-2">{total}</div>
        <div className="text-blue-100 text-sm mt-2 italic font-light">
          Tăng ≥ 2 điểm so với nền gợi ý nhiễm trùng huyết
        </div>
      </div>
    </div>
  );
};

export default SOFA2Calculator;
