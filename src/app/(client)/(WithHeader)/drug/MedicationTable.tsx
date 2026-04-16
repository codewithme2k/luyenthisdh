"use client";

import React, { useState, useMemo } from "react";
import {
  medicationData,
  MedicationOrder,
} from "@/app/(client)/(WithHeader)/drug/medication-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Plus,
  Minus,
  Info,
  Droplet,
  Stethoscope,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Badge = ({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "success";
}) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    success:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};

export default function MedicationTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const groups = useMemo(() => {
    const allGroups = medicationData
      .map((item) => item.group)
      .filter((group) => group !== "");
    return Array.from(new Set(allGroups));
  }, []);

  const filteredData = useMemo(() => {
    return medicationData.filter((item) => {
      const matchesSearch =
        item.drug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.order.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.note || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup = selectedGroup ? item.group === selectedGroup : true;

      return matchesSearch && matchesGroup;
    });
  }, [searchTerm, selectedGroup]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getGroupBadgeColor = (group: string) => {
    switch (group) {
      case "Kháng sinh":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Dinh dưỡng":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
      case "Giảm đau":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "Kháng viêm":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <Card className="w-full overflow-hidden border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-600/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-500" />
            Danh Mục Y Lệnh Thuốc
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border shadow-sm">
            <Pill className="w-4 h-4" />
            <span>Tổng số: {medicationData.length} mục</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm thuốc, y lệnh..."
              className="pl-10 h-11 bg-white dark:bg-slate-900/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Button
              variant={selectedGroup === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGroup(null)}
              className="whitespace-nowrap rounded-full"
            >
              Tất cả
            </Button>
            {groups.map((group) => (
              <Button
                key={group}
                variant={selectedGroup === group ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGroup(group)}
                className="whitespace-nowrap rounded-full"
              >
                {group}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="w-[60px] text-center">STT</TableHead>
                <TableHead className="min-w-[200px]">Tên Thuốc</TableHead>
                <TableHead className="hidden md:table-cell">Y Lệnh</TableHead>
                <TableHead className="hidden lg:table-cell">Nhóm</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Đường dùng
                </TableHead>
                <TableHead className="w-[100px] text-center">Pha Chế</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow
                      className={cn(
                        "cursor-pointer transition-colors group",
                        expandedRows.has(item.id)
                          ? "bg-blue-50/30 dark:bg-blue-900/10"
                          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30",
                      )}
                      onClick={() => toggleExpand(item.id)}
                    >
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {item.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {item.drug}
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1 sm:hidden">
                            {item.group && (
                              <Badge
                                className={cn(
                                  "text-[10px]",
                                  getGroupBadgeColor(item.group),
                                )}
                              >
                                {item.group}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px]">
                              {item.route}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {item.order || (
                            <span className="italic text-slate-400 text-xs">
                              Chưa cập nhật
                            </span>
                          )}
                        </p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {item.group ? (
                          <Badge
                            className={cn(
                              "border",
                              getGroupBadgeColor(item.group),
                            )}
                          >
                            {item.group}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm font-medium">
                          {item.route}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.dilution ? (
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <Droplet className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Không
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(item.id) && (
                      <TableRow className="bg-blue-50/30 dark:bg-blue-900/5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <TableCell colSpan={6} className="p-0">
                          <div className="px-6 py-4 border-t border-blue-100/50 dark:border-blue-900/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                                    <Info className="w-3.5 h-3.5" />
                                    Hướng dẫn chi tiết
                                  </h4>
                                  <p className="text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                    {item.order || "Không có hướng dẫn cụ thể."}
                                  </p>
                                </div>
                                {item.route && (
                                  <div className="sm:hidden">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                      Đường dùng
                                    </h4>
                                    <p className="font-medium">{item.route}</p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-4">
                                {item.dilution && (
                                  <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2 flex items-center gap-1.5">
                                      <Droplet className="w-3.5 h-3.5" />
                                      Pha chế & Lưu ý
                                    </h4>
                                    <div className="bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 text-sm">
                                      {item.note ||
                                        "Cần pha thêm dung môi theo y lệnh."}
                                    </div>
                                  </div>
                                )}
                                {!item.dilution && item.note && (
                                  <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                      Ghi chú
                                    </h4>
                                    <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg text-sm">
                                      {item.note}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="w-8 h-8 mb-2 opacity-20" />
                      <p>Không tìm thấy thuốc nào khớp với tìm kiếm của bạn.</p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedGroup(null);
                        }}
                        className="mt-2"
                      >
                        Xóa tất cả bộ lọc
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-3 border-t text-[10px] text-muted-foreground flex justify-between items-center">
        <span>© 2026 Hệ thống Y lệnh Số hóa</span>
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3" /> Nhấn vào hàng để xem chi tiết hướng dẫn
          pha chế
        </span>
      </div>
    </Card>
  );
}
