"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { Twemoji } from "@/components/customs/twemoji";

import {
  useBlogStats,
  useUpdateBlogStats,
} from "@/shared/hooks/use-blog-stats";
import { Stats, StatsType } from "@/generated/prisma/client";

const MAX_REACTIONS = 10;

// Định nghĩa kiểu dữ liệu cho các lượt reaction lưu trữ cục bộ
type ReactionCounts = Partial<Record<keyof Stats, number>>;

const REACTIONS: Array<{ emoji: string; key: keyof Stats }> = [
  {
    emoji: "sparkling-heart",
    key: "loves",
  },
  {
    emoji: "clapping-hands",
    key: "applauses",
  },
  {
    emoji: "bullseye",
    key: "bullseyes",
  },
  {
    emoji: "light-bulb",
    key: "ideas",
  },
];

export function Reactions({
  type,
  slug,
  className,
}: {
  type: StatsType;
  slug: string;
  className?: string;
}) {
  let [stats, isLoading] = useBlogStats(type, slug);
  let updateReaction = useUpdateBlogStats();

  // Khởi tạo state với kiểu dữ liệu cụ thể thay vì {}
  let [initialReactions, setInitialReactions] = useState<ReactionCounts>({});
  let [reactions, setReactions] = useState<ReactionCounts>({});

  useEffect(() => {
    try {
      let data = JSON.parse(localStorage.getItem(`${type}/${slug}`) || "{}");
      data.loves = data.loves || 0;
      data.applauses = data.applauses || 0;
      data.ideas = data.ideas || 0;
      data.bullseyes = data.bullseyes || 0;
      setInitialReactions(Object.assign({}, data));
      setReactions(Object.assign({}, data));
    } catch (e) {}
  }, [type, slug]);

  function handleChange(key: keyof Stats) {
    updateReaction({
      type,
      slug,
      // Sử dụng assertion 'as number' và fallback 0 để TS không than phiền
      [key]:
        ((stats[key] as number) || 0) +
        (reactions[key] || 0) -
        (initialReactions[key] || 0),
    });
    localStorage.setItem(`${type}/${slug}`, JSON.stringify(reactions));
  }

  return (
    <div className={clsx("flex items-center gap-6", className)}>
      {REACTIONS.map(({ key, emoji }) => (
        <Reaction
          key={key}
          path={`${type}/${slug}`}
          react={{ emoji, key }}
          value={
            isLoading
              ? "--"
              : ((stats[key] as number) || 0) +
                (reactions[key] || 0) -
                (initialReactions[key] || 0)
          }
          reactions={reactions[key] || 0}
          onReact={(v) => setReactions((r) => ({ ...r, [key]: v }))}
          onSave={() => handleChange(key)}
        />
      ))}
    </div>
  );
}

function Reaction({
  path,
  react,
  value,
  reactions,
  onReact,
  onSave,
}: {
  path: string;
  react: (typeof REACTIONS)[number];
  value: string | number;
  reactions: number;
  onReact: (v: number) => void;
  onSave: () => void;
}) {
  let { emoji, key } = react;
  let [reacting, setReacting] = useState(false);
  let countRef = useRef<HTMLSpanElement>(null);
  let reactingTimeoutId = useRef<ReturnType<typeof setTimeout>>(undefined);
  function handleReact() {
    if (typeof value === "number") {
      if (reactingTimeoutId.current) {
        clearTimeout(reactingTimeoutId.current);
      }
      setReacting(true);
      let newReactions =
        reactions >= MAX_REACTIONS ? MAX_REACTIONS : reactions + 1;
      onReact(newReactions);

      if (countRef.current && reactions >= MAX_REACTIONS) {
        countRef.current.classList.add("animate-scale-up");
        setTimeout(() => {
          if (countRef.current) {
            countRef.current.classList.remove("animate-scale-up");
          }
        }, 150);
      }
    }
  }

  function handleMouseLeave() {
    if (typeof value === "number" && reacting) {
      reactingTimeoutId.current = setTimeout(() => {
        setReacting(false);
        onSave();
      }, 1000);
    }
  }

  return (
    <button
      onClick={handleReact}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center gap-1.5"
      data-umami-event="post-reaction"
      data-umami-event-post={path}
      data-umami-event-react={key}
    >
      <Twemoji emoji={emoji} size="2x" />
      <span className="relative h-6 w-8 overflow-hidden">
        <span
          className={clsx(
            "absolute inset-0",
            "font-semibold text-gray-600 dark:text-gray-300",
            "transition-all",
            reacting ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100",
          )}
        >
          {value}
        </span>
        <span
          ref={countRef}
          className={clsx(
            "absolute inset-0",
            "text-gray-500 dark:text-gray-400",
            "transition-all",
            reacting ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          +{reactions}
        </span>
      </span>
    </button>
  );
}
