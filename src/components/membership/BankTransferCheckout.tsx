"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type Props = {
  orderId: string;
  courseTitle: string;
  amount: number;
  bank: {
    name: string;
    accountNumber: string;
    accountName: string;
  };
};

export function BankTransferCheckout({
  orderId,
  courseTitle,
  amount,
  bank,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`Đã sao chép ${label}`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="max-w-xl mx-auto my-10 shadow-lg rounded-2xl border">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          Thanh toán chuyển khoản
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-muted-foreground">Khóa học:</p>
          <p className="font-semibold">{courseTitle}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Số tiền cần chuyển:</p>
          <p className="text-lg font-bold text-green-600">
            {amount.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Ngân hàng:</p>
              <p className="font-semibold">{bank.name}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(bank.name, "ngân hàng")}
            >
              {copied === "ngân hàng" ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Số tài khoản:</p>
              <p className="font-semibold">{bank.accountNumber}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(bank.accountNumber, "số tài khoản")}
            >
              {copied === "số tài khoản" ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Chủ tài khoản:</p>
              <p className="font-semibold">{bank.accountName}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(bank.accountName, "chủ tài khoản")}
            >
              {copied === "chủ tài khoản" ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Nội dung chuyển khoản:</p>
              <p className="font-semibold">{orderId}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(orderId, "nội dung")}
            >
              {copied === "nội dung" ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        <Button className="w-full mt-4" asChild>
          <Link href="/membership">Tôi đã chuyển khoản</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
