import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: SectionProps) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8", className)}
    >
      {children}
    </section>
  );
}
