"use client";

import { useEffect } from "react";

import {
  useBlogStats,
  useUpdateBlogStats,
} from "@/shared/hooks/use-blog-stats";
import { StatsType } from "@/generated/prisma/enums";

export function ViewsCounter({
  type,
  slug,
  className,
}: {
  type: StatsType;
  slug: string;
  className?: string;
}) {
  let [stats, isLoading] = useBlogStats(type, slug);
  let updateView = useUpdateBlogStats();

  useEffect(() => {
    if (!isLoading && stats) {
      updateView({ type, slug, views: stats["views"] + 1 });
    }
  }, [stats, isLoading]);

  return (
    <span className={className}>
      {isLoading ? "---" : (stats["views"] || 0) + " views"}
    </span>
  );
}
