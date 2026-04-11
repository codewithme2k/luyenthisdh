"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

export function Comments({ url }: { url: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, [url]);

  // Nếu chưa mount xong (đang ở server), không render div của Facebook
  if (!mounted)
    return <div className="animate-pulse bg-gray-100 h-32 w-full rounded" />;

  return (
    <div
      className="fb-comments"
      data-href={url}
      data-width="100%"
      data-numposts="5"
    ></div>
  );
}
