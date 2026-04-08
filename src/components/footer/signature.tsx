import Image from "next/image";
import { clsx } from "clsx";

interface SignatureProps {
  className?: string;
}

export function Signature({ className }: SignatureProps) {
  return (
    <Image
      src="/static/images/signature.png"
      alt="My personal signature"
      width={200}
      height={150}
      className={clsx("dark:invert object-contain", className)}
      priority
    />
  );
}
