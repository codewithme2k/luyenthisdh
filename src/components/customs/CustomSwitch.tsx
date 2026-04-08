"use client";

import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";

interface StatusSwitchProps<T extends string> {
  status: T;
  valueMap: {
    trueValue: T;
    falseValue: T;
  };
  onChange: (newStatus: T) => Promise<{ success: boolean; message?: string }>;
}

/**
 * Switch component cập nhật trạng thái linh hoạt bằng hàm truyền vào
 */
export function StatusSwitch<T extends string>({
  status,
  valueMap,
  onChange,
}: StatusSwitchProps<T>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isChecked = status === valueMap.trueValue;

  const handleToggle = async (checked: boolean) => {
    const newStatus = checked ? valueMap.trueValue : valueMap.falseValue;

    try {
      setLoading(true);
      const result = await onChange(newStatus);

      if (!result.success) {
        toast.error(result.message || "Cập nhật thất bại");
        return;
      }

      toast.success("Cập nhật thành công");
      router.refresh(); // Làm mới trang nếu cần
    } catch (error) {
      toast.error("Cập nhật thất bại", {
        description:
          error instanceof Error ? error.message : "Lỗi không xác định",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={handleToggle}
      disabled={loading}
    />
  );
}
