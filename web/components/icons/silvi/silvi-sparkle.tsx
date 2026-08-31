import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Silvi Cyber Sparkle Accent Icon
 */
export function SilviSparkle({
  size = 18,
  className,
  ...props
}: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Sparkle"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <defs>
        <linearGradient id="sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fa5d00" />
          <stop offset="50%" stopColor="#fee3b5" />
          <stop offset="100%" stopColor="#fa5d00" />
        </linearGradient>
      </defs>
      <path
        d="M 12 1 C 12 7.5 17.5 12 23 12 C 17.5 12 12 16.5 12 23 C 12 16.5 6.5 12 1 12 C 6.5 12 12 7.5 12 1 Z"
        fill="url(#sparkle-grad)"
      />
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
    </svg>
  );
}
