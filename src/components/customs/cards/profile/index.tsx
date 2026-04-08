"use client";

import { clsx } from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SpotifyNowPlaying } from "@/components/customs/now-playing";
import { ProfileCardInfo } from "./profile-info";
import { Image } from "@/components/customs/image";
import { SITE_METADATA } from "@/shared/site-metadata";

export function ProfileCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glintStyle, setGlintStyle] = useState<React.CSSProperties>({});

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current || window.innerWidth < 1280) return;

    const { clientX, clientY } = e;
    const { width, height, x, y } = ref.current.getBoundingClientRect();
    const mouseX = Math.abs(clientX - x);
    const mouseY = Math.abs(clientY - y);

    // Hiệu ứng xoay 3D nhẹ nhàng (10 độ)
    const rotateMin = -10;
    const rotateMax = 10;
    const rotateRange = rotateMax - rotateMin;

    const rotate = {
      x: rotateMax - (mouseY / height) * rotateRange,
      y: rotateMin + (mouseX / width) * rotateRange,
    };

    setStyle({
      transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
    });

    // Tạo điểm sáng phản chiếu theo con trỏ chuột
    setGlintStyle({
      background: `radial-gradient(circle at ${(mouseX / width) * 100}% ${
        (mouseY / height) * 100
      }%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.0) 80%)`,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setStyle({ transform: "rotateX(0deg) rotateY(0deg)" });
    setGlintStyle({});
  }, []);

  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    current.addEventListener("mousemove", onMouseMove);
    current.addEventListener("mouseleave", onMouseLeave);
    return () => {
      if (!current) return;
      current.removeEventListener("mousemove", onMouseMove);
      current.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [onMouseLeave, onMouseMove]);

  return (
    <div
      className="z-10 mb-8 scale-100 transition-all duration-300 ease-out hover:z-50 md:mb-0 md:hover:scale-[1.05]"
      style={{ perspective: "1200px" }}
      ref={ref}
    >
      <div
        style={style}
        className={clsx(
          "relative flex flex-col overflow-hidden transition-all duration-300 ease-out md:rounded-3xl",
          "bg-white dark:bg-[#1a1a1a]", // Màu nền tối đậm hơn để nổi bật chữ
          "shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          "border border-gray-100 dark:border-gray-800",
        )}
      >
        {/* Lớp hiệu ứng ánh sáng bề mặt */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 hover:opacity-100"
          style={glintStyle}
        />

        {/* Phần Hình ảnh Logo/Avatar */}
        <div className="relative overflow-hidden group">
          <Image
            src={SITE_METADATA.siteLogo}
            alt={SITE_METADATA.title}
            width={550}
            height={350}
            className="transition-transform duration-700 ease-in-out group-hover:scale-110"
            style={{
              objectPosition: "50% 15%",
              aspectRatio: "383/240",
            }}
            loading="eager"
          />
          {/* Gradient phủ nhẹ phần chân ảnh */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white dark:from-[#1a1a1a] to-transparent opacity-80" />
        </div>

        {/* Widget Spotify - Đã tối ưu hiển thị chữ */}
        <SpotifyNowPlaying
          className={clsx([
            "relative z-20 border-y border-gray-100 dark:border-gray-800",
            "bg-gray-50/50 dark:bg-black/20 backdrop-blur-md",
            "px-4 py-3 xl:px-6",
            // Khắc phục lỗi chữ: Buộc dùng màu có độ tương phản cao
            "text-gray-900 dark:text-white",
            "[--song-color:inherit] [--artist-color:inherit]",
          ])}
        />

        {/* Thông tin cá nhân - Bọc lớp màu chữ tổng thể */}
        <div className="relative z-20 text-gray-900 dark:text-gray-100">
          <ProfileCardInfo />
        </div>

        {/* Thanh trang trí Gradient mỏng dưới cùng */}
        <span className="h-1.5 w-full bg-linear-to-r from-green-400 via-blue-500 to-purple-600 opacity-90" />
      </div>
    </div>
  );
}
