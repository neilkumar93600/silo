import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

export interface SilviIconGlyphProps extends BaseIconProps {
  glow?: boolean;
}

/**
 * Compact Silvi AI Mascot icon glyph for buttons, toolbars, and status badges
 */
export function SilviIcon({
  size = 20,
  glow = false,
  className,
  ...props
}: SilviIconGlyphProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Silvi Icon"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <defs>
        <radialGradient id="silvi-glyph-body" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>
      </defs>

      {/* Head Sphere */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="url(#silvi-glyph-body)"
        stroke="#ffffff"
        strokeWidth="0.75"
        strokeOpacity="0.8"
      />

      {/* Ears */}
      <circle cx="3.5" cy="11" r="1.5" fill="#c026d3" />
      <circle cx="20.5" cy="11" r="1.5" fill="#06b6d4" />

      {/* Dark Visor */}
      <rect x="6.5" y="8.5" width="11" height="7" rx="3.5" fill="#18181b" />

      {/* Visor Eyes */}
      <circle cx="9.5" cy="12" r="1" fill="#00f575" />
      <circle cx="14.5" cy="12" r="1" fill="#00f575" />
    </svg>
  );
}
