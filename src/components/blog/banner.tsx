import { clsx } from "clsx";
import { GritBackground } from "@/components/customs/grit-background";
import { GrowingUnderline } from "@/components/customs/growing-underline";
import { Image, Zoom } from "@/components/customs/image";

import { capitalize, kebabCaseToPlainText } from "@/utils/misc";
import Link from "next/link";

export function Banner({
  banner,
  className,
}: {
  banner: string;
  className?: string;
}) {
  // 1. Xử lý tách chuỗi an toàn
  const parts = banner.split("__");
  const isUnsplashFormat = parts.length === 3;

  // Nếu là format Unsplash (path__author__id) thì lấy đủ,
  // nếu không (link thường) thì lấy banner làm path, còn lại để trống
  const [path, author, filename] = isUnsplashFormat ? parts : [banner, "", ""];

  // 2. Lấy handle để làm Alt text (ví dụ: "banner" từ "/static/images/banner.jpeg")
  const handle = path.split("/").pop()?.split(".")[0] || "";

  // 3. Lấy ID cho link Unsplash (nếu có)
  const imageId = filename?.includes(".") ? filename.split(".")[0] : "";

  return (
    <div className={clsx("relative", className)}>
      {/* Chỉ hiện Credit nếu là định dạng Unsplash hợp lệ */}
      {isUnsplashFormat && author && imageId && (
        <Credit
          author={author}
          id={imageId}
          className={clsx([
            "absolute right-4 top-4 z-10",
            "hidden rounded-xl px-3 py-0.5 lg:block",
            "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
          ])}
        />
      )}

      <Zoom>
        <div className="w-full aspect-video overflow-hidden rounded-lg">
          <Image
            src={banner}
            alt={
              capitalize(kebabCaseToPlainText(handle)) || "Article banner photo"
            }
            width={1600}
            height={900}
            className="w-full h-full object-cover"
          />
        </div>
      </Zoom>
      <GritBackground className="inset-0 rounded-lg opacity-75" />
    </div>
  );
}

interface CreditProps {
  author: string;
  id: string;
  className?: string;
}

function Credit({ author, id, className }: CreditProps) {
  return (
    <div className={clsx("text-sm italic", className)}>
      Photo by{" "}
      <Link className="font-semibold" href={`https://unsplash.com/@${author}`}>
        <GrowingUnderline data-umami-event="banner-author">
          @{author}
        </GrowingUnderline>
      </Link>{" "}
      on{" "}
      <Link
        className="font-semibold"
        href={`https://unsplash.com/photos/${id}`}
      >
        <GrowingUnderline data-umami-event="banner-unsplash">
          Unsplash
        </GrowingUnderline>
      </Link>
    </div>
  );
}
