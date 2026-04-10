# Luyện Thi Sau Đại Học (Luyenthisdh)

Nền tảng học tập và ôn thi chuyên sâu dành cho học viên Sau đại học khối ngành Y Dược.

## 🚀 Giới thiệu dự án

Dự án **Luyện Thi Sau Đại Học** là một ứng dụng web hiện đại được thiết kế để cung cấp tài liệu, công cụ và lộ trình ôn tập tối ưu cho các kỳ thi Chuyên khoa I, Chuyên khoa II, Thạc sĩ và Nội trú.

## ✨ Tính năng chính

- 📚 **Hệ thống Blog/Bài viết**: Kho tin tức, tài liệu và kinh nghiệm ôn thi được quản lý qua MDX (Contentlayer 2).
- 🛠️ **Công cụ tương tác**: Các công cụ hỗ trợ tính toán lâm sàng và học tập chuyên biệt.
- 🔐 **Hệ thống thành viên**: Quản lý tài khoản, nâng cấp VIP để truy cập nội dung độc quyền.
- 💳 **Thanh toán trực tuyến**: Quy trình đăng ký và nâng cấp tài khoản tự động qua hệ thống Checkout.
- 📊 **Bảng điều khiển (Dashboard)**:
  - **Admin**: Quản lý nội dung, người dùng và hệ thống.
  - **User**: Theo dõi tiến độ học tập và thông tin cá nhân.
- 🔍 **Tìm kiếm thông minh**: Tìm kiếm nội dung nhanh chóng với Kbar.
- 🌓 **Chế độ giao diện**: Hỗ trợ Dark mode và Light mode linh hoạt.

## 🛠️ Công nghệ sử dụng

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/).
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Next-gen), [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/).
- **Quản lý nội dung**: [Contentlayer 2](https://contentlayer.dev/) (Quản lý file MDX).
- **Cơ sở dữ liệu**: [Prisma](https://www.prisma.io/) và [PostgreSQL](https://www.postgresql.org/).
- **Xác thực**: [Auth.js v5](https://authjs.dev/) (NextAuth).
- **Tiện ích**:
  - `rehype`/`remark` plugins (hỗ trợ Math - KaTeX, Citation, GFM).
  - `UploadThing` (Xử lý tải lên tệp tin).
  - `SWR` (Data fetching và caching).
  - `Zod` & `React Hook Form` (Quản lý form và validation).

## 📂 Cấu trúc thư mục

- `src/app/(client)`: Các trang công khai dành cho người dùng (Blog, Tools, About...).
- `src/app/(dashboard)`: Giao diện quản trị (Admin) và cá nhân (User).
- `src/components`: Hệ thống thành phần (Components) tái sử dụng, bao gồm cả UI nền tảng.
- `data`: Lưu trữ các tệp tin MDX cho bài viết và tác giả.
- `prisma`: Schema và migrations cho cơ sở dữ liệu.

## 🛠️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Node.js 18.x trở lên.
- PostgreSQL database.

### 2. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 3. Cấu hình biến môi trường
Sao chép tệp `.env.example` thành `.env` và điền đầy đủ các thông tin cần thiết:
```bash
cp .env.example .env
```

### 4. Khởi tạo Cơ sở dữ liệu
```bash
npx prisma generate
npx prisma db push
```

### 5. Chạy dự án ở chế độ phát triển
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📄 Giấy phép

Dự án được phát triển và quản lý bởi Luyenthisdh Team.
