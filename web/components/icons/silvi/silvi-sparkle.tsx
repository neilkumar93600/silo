import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Cyber-Sparkle Starburst Icon with Neon Violet & Signal Green highlights
 */
export function SilviSparkle({
  size = 20,
  className,
  ...props
}: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Silvi Sparkle"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <defs>
        <linearGradient id="sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9efa" />
          <stop offset="50%" stopColor="#b997ff" />
          <stop offset="100%" stopColor="#00f575" />
        </linearGradient>
      </defs>

      {/* Main 4-point Diamond Star */}
      <path
        d="M 12 2 Q 12 12 2 12 Q 12 12 12 22 Q 12 12 22 12 Q 12 12 12 2 Z"
        fill="url(#sparkle-grad)"
      />

      {/* Secondary Mini Sparkle */}
      <path
        d="M 19 3 Q 19 6 16 6 Q 19 6 19 9 Q 19 6 22 6 Q 19 6 19 3 Z"
        fill="#00f575"
        opacity="0.85"
      />

      {/* Tertiary Micro Sparkle */}
      <circle cx="5" cy="19" r="1.5" fill="#ff9efa" opacity="0.9" />
    </svg>
  );
}
