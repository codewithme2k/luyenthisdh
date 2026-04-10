"use client";

import * as React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { clsx } from "clsx";

type TocItem = {
  value: string;
  url: string;
  depth: number;
};

export function TableOfContents({
  toc,
  className,
}: {
  toc: TocItem[];
  className?: string;
}) {
  const h2Groups = React.useMemo(() => {
    const groups: { parent: TocItem; children: TocItem[] }[] = [];
    toc.forEach((item) => {
      if (item.depth === 2) {
        groups.push({ parent: item, children: [] });
      } else if (groups.length > 0) {
        groups[groups.length - 1].children.push(item);
      }
    });
    return groups;
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  return (
    <div className={clsx("w-full space-y-4", className)}>
      <div className="px-2 text-sm font-black uppercase tracking-widest text-foreground/70">
        On this page
      </div>

      <Accordion
        type="multiple"
        defaultValue={h2Groups.map((_, i) => `item-${i}`)}
        className="w-full"
      >
        {h2Groups.map((group, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-none py-0 mb-1"
          >
            <div className="flex items-center">
              {group.children.length > 0 ? (
                <AccordionTrigger className="flex-1 py-2.5 hover:no-underline hover:bg-accent/50 px-2 rounded-md transition-all [&>svg]:w-5 [&>svg]:h-5">
                  <Link
                    href={group.parent.url}
                    className="text-[16px] font-bold text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {group.parent.value}
                  </Link>
                </AccordionTrigger>
              ) : (
                <Link
                  href={group.parent.url}
                  className="flex-1 py-2.5 px-2 text-[16px] font-bold text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-all"
                >
                  {group.parent.value}
                </Link>
              )}
            </div>

            {group.children.length > 0 && (
              <AccordionContent className="pb-3 pt-1 ml-4 border-l-2 border-muted pl-1">
                <ul className="flex flex-col space-y-2">
                  {group.children.map((child, i) => (
                    <li key={i}>
                      <Link
                        href={child.url}
                        className={clsx(
                          "block py-2 px-4 text-[15px] font-bold transition-all border-l-4 -ml-[6px] hover:border-primary/40 hover:text-foreground text-muted-foreground/80",
                          child.depth === 4 && "ml-4 opacity-70 text-[14px]",
                        )}
                      >
                        {child.value}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
