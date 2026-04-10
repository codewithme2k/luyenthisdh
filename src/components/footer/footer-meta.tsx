"use client";

import { useEffect, useState } from "react";

import { GrowingUnderline } from "@/components/customs/growing-underline";
import { Twemoji } from "@/components/customs/twemoji";
import { SITE_METADATA } from "@/shared/site-metadata";
import { GithubRepository } from "@/shared/types/data";
import { fetcher } from "@/utils/misc";

import { Clock, Github, MapPin, Star } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const TIME_IS = "https://time.is/Ho_Chi_Minh";
const MY_TIMEZONE = "Asia/Ho_Chi_Minh";
const MY_TIMEZONE_OFFSET = 7 * -60; // UTC+7

function getTime() {
  const date = new Date();
  const visitorTimezoneOffset = date.getTimezoneOffset();
  const hoursDiff = (visitorTimezoneOffset - MY_TIMEZONE_OFFSET) / 60;

  const diff =
    hoursDiff === 0
      ? "same time"
      : hoursDiff > 0
      ? `${hoursDiff}h ahead`
      : `${hoursDiff * -1}h behind`;

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: MY_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return { time, diff };
}

export function FooterMeta() {
  const [timeData, setTimeData] = useState<{
    time: string;
    diff: string;
  } | null>(null);

  useEffect(() => {
    setTimeData(getTime());

    // optional: cập nhật mỗi phút
    const interval = setInterval(() => {
      setTimeData(getTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const siteRepo = SITE_METADATA.siteRepo.replace(
    "https://github.com/",
    "",
  );
  const repoName = siteRepo.split("/")[1];

  const { data: repo } = useSWR<GithubRepository>(
    `/api/github?repo=${siteRepo}`,
    fetcher,
  );

  return (
    <div className="space-y-2 py-1.5 text-gray-800 dark:text-gray-200">
      {/* Repo */}
      <div className="flex items-center gap-1 font-medium">
        <Github className="h-5 w-5" />
        <Link href={SITE_METADATA.siteRepo} className="ml-1">
          <GrowingUnderline data-umami-event="view-repo">
            {repoName}
          </GrowingUnderline>
        </Link>
        <span>-</span>
        <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
          <Star className="mr-1 h-4 w-4" />
          {repo ? <span>{repo.stargazerCount}</span> : "---"}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        <span className="font-medium">
          [::1]:443 - Sai Gon{" "}
          <Twemoji emoji="flag-vietnam" className="h-4.5!" />
        </span>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        <Link href={TIME_IS}>
          <GrowingUnderline
            className="font-medium"
            data-umami-event="footer-time"
          >
            {timeData ? (
              <>
                {timeData.time}{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  - {timeData.diff}
                </span>
              </>
            ) : (
              "Loading..."
            )}
          </GrowingUnderline>
        </Link>
      </div>
    </div>
  );
}