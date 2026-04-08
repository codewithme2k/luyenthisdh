"use client";

import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import MadeInVietNam from "@/components/icons/miv.svg";
import { LastCommit } from "./last-commit";
import { SpotifyNowPlaying } from "@/components/customs/now-playing";
import { SITE_METADATA } from "@/shared/site-metadata";
import Link from "next/link";

export function FooterBottom() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={clsx([
        "pt-5 md:my-2",
        "flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:gap-16",
        "border-t border-gray-200 dark:border-gray-700",
      ])}
    >
      {isHomePage ? (
        <LastCommit />
      ) : (
        <SpotifyNowPlaying
          className="w-full justify-center truncate [--artist-color:var(--color-gray-500)] md:max-w-[50%] md:justify-start"
          songEffect="underline"
          showCover
        />
      )}
      <Link href={SITE_METADATA.siteRepo}>
        <span data-umami-event="made-in-vietnam">
          <MadeInVietNam />
        </span>
      </Link>
    </div>
  );
}
