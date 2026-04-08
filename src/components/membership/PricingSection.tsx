"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { memberShip } from "@/shared/actions/membership";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "MONTHLY",
    title: "Personal",
    price: "50.000đ",
    duration: "/ tháng",
    description: "Giải pháp cơ bản cho cá nhân mới bắt đầu.",
    features: ["Truy cập cơ bản", "Cập nhật nội dung mới"],
    save: null,
    badge: null,
  },
  {
    id: "HALF_YEAR",
    title: "Master",
    price: "250.000đ",
    duration: "/ 6 tháng",
    description: "Lựa chọn tối ưu để duy trì thói quen học tập.",
    features: [
      "Truy cập toàn bộ khóa học",
      "Nội dung hấp dẫn",
      "Hỗ trợ ưu tiên",
    ],
    save: "Tiết kiệm 28%",
    badge: "Khuyên dùng",
    highlight: true,
  },
  {
    id: "YEARLY",
    title: "Premium",
    price: "400.000đ",
    duration: "/ 12 tháng",
    description: "Đầu tư dài hạn với mức giá tiết kiệm nhất.",
    features: [
      "Mọi tính năng của Master",
      "Lộ trình học cá nhân hóa",
      "Tham gia cộng đồng kín",
    ],
    save: "Tiết kiệm 50%",
    badge: null,
  },
  {
    id: "LIFETIME",
    title: "LifeTime",
    price: "1.000.000đ",
    duration: "Vĩnh viễn",
    description: "Mua một lần, sở hữu trọn đời. Không giới hạn.",
    features: [
      "Mọi tính năng của Premium",
      "Cập nhật miễn phí trọn đời",
      "Hỗ trợ 1-1 chuyên sâu",
    ],
    save: "Tiết kiệm 10%",
    badge: null,
  },
];

export default function PricingSection() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-7xl">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
          Đầu tư cho sự phát triển của bạn
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Chọn gói thành viên phù hợp với mục tiêu. Nâng cấp hoặc hủy bất kỳ lúc
          nào.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function PricingCard({ plan }: { plan: (typeof plans)[number] }) {
  const router = useRouter();
  const {
    title,
    price,
    duration,
    description,
    features,
    save,
    badge,
    highlight,
    id,
  } = plan;
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(planId: string) {
    setLoading(true);
    try {
      const data = await memberShip(planId);
      if (data.success) {
        toast.success("Đăng ký thành công!");
        router.push(`/checkout/${data.data?.order}`);
      } else {
        toast.error(data.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      className={`group relative flex flex-col h-full transition-all duration-300 ease-out hover:-translate-y-1 bg-card text-card-foreground ${
        highlight
          ? "border-blue-600 dark:border-blue-500 shadow-lg ring-1 ring-blue-600 dark:ring-blue-500 dark:shadow-[0_8px_30px_rgba(59,130,246,0.15)]"
          : "border-border shadow-sm hover:border-blue-400 dark:hover:border-blue-800 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      }`}
    >
      <CardHeader className="p-6 pb-4">
        <div className="flex justify-between items-start min-h-[32px]">
          <h3
            className={`text-xl font-bold transition-colors duration-300 ${
              highlight
                ? "text-blue-600 dark:text-blue-400"
                : "text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400"
            }`}
          >
            {title}
          </h3>
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5" />
              {badge}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">
          {description}
        </p>

        <div className="mt-4 flex items-end gap-1">
          <span className="text-4xl font-extrabold text-foreground tracking-tight">
            {price}
          </span>
          <span className="text-base font-medium text-muted-foreground mb-1">
            {duration}
          </span>
        </div>

        {save ? (
          <div className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 w-fit px-2 py-0.5 rounded transition-colors duration-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60">
            {save}
          </div>
        ) : (
          <div className="mt-2 h-[24px]"></div>
        )}
      </CardHeader>

      <div className="px-6">
        <hr className="border-border transition-colors duration-300 group-hover:border-blue-200 dark:group-hover:border-blue-800" />
      </div>

      <CardContent className="p-6 flex-1">
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-foreground/80 dark:text-foreground/70"
            >
              <CheckCircle2
                className={`w-5 h-5 shrink-0 transition-colors duration-300 ${
                  highlight
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-muted-foreground/50 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                }`}
              />
              <span className="text-sm leading-tight">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <Button
          className={`w-full h-12 text-base font-medium transition-all duration-300 ${
            highlight
              ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md"
              : "bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground group-hover:border-blue-400 dark:group-hover:border-blue-700 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          }`}
          onClick={() => handleSubscribe(id)}
          disabled={loading}
          variant={highlight ? "default" : "outline"}
        >
          {loading ? "Đang xử lý..." : "Đăng ký ngay"}
        </Button>
      </CardFooter>
    </Card>
  );
}
