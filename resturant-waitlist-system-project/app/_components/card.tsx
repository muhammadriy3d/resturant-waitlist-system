import type { HTMLAttributes } from "react";
import { cn } from "@/app/_lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-stone-200/80 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(35,45,29,0.28)] sm:p-9",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
