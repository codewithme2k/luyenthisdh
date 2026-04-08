import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 pt-20 pb-10 border-t border-slate-100 dark:border-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 text-left">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
            Y Khoa <span className="text-blue-600">Số</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed">
            Nền tảng đào tạo y khoa số hàng đầu Việt Nam, giúp bác sĩ cập nhật
            kiến thức liên tục và thực chiến hơn trong lâm sàng.
          </p>
        </div>
        <div className="space-y-6">
          <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white underline underline-offset-8 decoration-blue-600 decoration-2">
            Liên kết
          </h4>
          <ul className="space-y-4 text-sm text-slate-500 font-bold uppercase tracking-tighter">
            <li className="hover:text-blue-600 cursor-pointer">Khoá học</li>
            <li className="hover:text-blue-600 cursor-pointer">
              Thư viện Case
            </li>
            <li className="hover:text-blue-600 cursor-pointer">Gói Hội Viên</li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white underline underline-offset-8 decoration-blue-600 decoration-2">
            Kết nối
          </h4>
          <ul className="space-y-4 text-sm text-slate-500 font-bold uppercase tracking-tighter">
            <li className="hover:text-blue-600 cursor-pointer">Facebook</li>
            <li className="hover:text-blue-600 cursor-pointer">YouTube</li>
            <li className="hover:text-blue-600 cursor-pointer">Cộng đồng</li>
          </ul>
        </div>
      </div>
      <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-[3px] border-t border-slate-50 dark:border-slate-900 pt-10">
        © 2026 Y KHOA SỐ • KIẾN THỨC LÀ SỨC MẠNH
      </p>
    </footer>
  );
}
