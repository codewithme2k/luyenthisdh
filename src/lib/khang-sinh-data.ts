export type ChapterType = 'images' | 'pdf';

export interface KhangSinhChapter {
  id: string;
  label: string;
  emoji: string;
  folder: string; // Folder name inside /public/khang-sinh/
  count: number;  // Number of images
  description?: string;
  type: ChapterType;
  pdfPath?: string;
}

export const KHANG_SINH_DATA: KhangSinhChapter[] = [
  {
    id: "chuong-1",
    label: "Chương 1: Phân loại tác nhân gây bệnh và thuốc điều trị",
    emoji: "📄",
    folder: "",
    count: 0,
    type: "pdf",
    pdfPath: "/khang-sinh/chuong01.pdf",
    description: "Nguyên tắc phân loại vi khuẩn, nấm và các nhóm thuốc điều trị tương ứng."
  },
  {
    id: "chuong-2",
    label: "Chương 2: Những điều cần biết khi sử dụng kháng sinh",
    emoji: "📄",
    folder: "",
    count: 0,
    type: "pdf",
    pdfPath: "/khang-sinh/chuong02.pdf",
    description: "Hướng dẫn lựa chọn, liều lượng và các lưu ý lâm sàng quan trọng."
  },
  {
    id: "chuong-3",
    label: "Chương 3: Khái niệm và ứng dụng PK/PD trong thực hành lâm sàng",
    emoji: "📄",
    folder: "",
    count: 0,
    type: "pdf",
    pdfPath: "/khang-sinh/chuong03.pdf",
    description: "Tối ưu hóa liều kháng sinh dựa trên đặc tính Dược động học và Dược lực học."
  },

  {
    id: "nhiem-khuan-huyet",
    label: "Nhiễm Khuẩn Huyết",
    emoji: "💉",
    folder: "Nhiễm khuẩn huyết",
    count: 8,
    type: "images",
    description: "Phác đồ điều trị nhiễm khuẩn huyết và sốc nhiễm khuẩn."
  },
  {
    id: "ho-hap",
    label: "Nhiễm Khuẩn Hô Hấp",
    emoji: "🫁",
    folder: "Hô hấp",
    count: 9,
    type: "images",
    description: "Viêm phổi cộng đồng, viêm phổi bệnh viện."
  },
  {
    id: "tieu-hoa",
    label: "Nhiễm Khuẩn Tiêu Hoá",
    emoji: "🫀",
    folder: "Tiêu hoá",
    count: 10,
    type: "images",
  },
  {
    id: "tiiet-nieu",
    label: "Niệu - Sinh Dục",
    emoji: "🔬",
    folder: "Niệu - sinh dục",
    count: 12,
    type: "images",
  },
  {
    id: "tim-mach",
    label: "Nhiễm Khuẩn Tim Mạch",
    emoji: "❤️",
    folder: "Tim mạch",
    count: 10,
    type: "images",
  },
  {
    id: "than-kinh",
    label: "Nhiễm Khuẩn Thần Kinh",
    emoji: "🧠",
    folder: "Thần kinh",
    count: 7,
    type: "images",
  },
  {
    id: "co-xuong-khop",
    label: "Cơ Xương Khớp",
    emoji: "🦴",
    folder: "CXK",
    count: 8,
    type: "images",
  },
  {
    id: "da-mo-mem",
    label: "Da và Mô Mềm",
    emoji: "🩹",
    folder: "Da mô mềm",
    count: 9,
    type: "images",
  },
  {
    id: "tmh-mat",
    label: "Tai Mũi Họng - Mắt",
    emoji: "👁️",
    folder: "TMH MẮT",
    count: 13,
    type: "images",
  },
  {
    id: "ban-chan-dtd",
    label: "NK Bàn chân ĐTĐ",
    emoji: "🦶",
    folder: "NK trên Baàn chaân ĐTĐ",
    count: 2,
    type: "images",
  },
  {
    id: "chay-than",
    label: "Thận - Lọc màng bụng",
    emoji: "🩺",
    folder: "Chạy thận - lọc màng bụng",
    count: 7,
    type: "images",
  },
  {
    id: "nam",
    label: "Nhiễm Nấm",
    emoji: "🍄",
    folder: "Nấm",
    count: 6,
    type: "images",
  },
  {
    id: "nam-kinh-nghiem",
    label: "Nấm theo kinh nghiệm",
    emoji: "🧪",
    folder: "Nấm theo kinh nhiệm",
    count: 3,
    type: "images",
  },
  {
    id: "vi-sinh",
    label: "Theo kết quả vi sinh",
    emoji: "🧫",
    folder: "Theo kết quả vi sinh",
    count: 31,
    type: "images",
  },
  {
    id: "viem-gan",
    label: "Viêm gan siêu vi",
    emoji: "🦠",
    folder: "Viêm gan siêu vi",
    count: 6,
    type: "images",
  }

];
