import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoIcon } from "./logo-icon";

export interface LogoLockupProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  badge?: string;
  iconSize?: number;
  textClassName?: string;
}

export function LogoLockup({
  href,
  iconSize = 24,
  badge,
  className,
  textClassName,
  ...props
}: LogoLockupProps) {
  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 group cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <LogoIcon
        size={iconSize}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "font-freckle text-2xl tracking-wide text-ink-black group-hover:text-harvest-flame transition-colors",
            textClassName
          )}
        >
          Silo
        </span>
        {badge && (
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-marigold-glow text-harvest-flame border border-harvest-flame/25">
            {badge}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
