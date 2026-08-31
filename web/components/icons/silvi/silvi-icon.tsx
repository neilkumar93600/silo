import * as React from "react";
import { cn } from "@/lib/utils";
import type { SilviIconProps } from "../types";

/**
 * Compact Silvi Mascot glyph for navigation bars, buttons, and command search
 */
export function SilviIcon({
  size = 20,
  glow = false,
  className,
  ...props
}: SilviIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Silvi Icon"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", glow && "drop-shadow-[0_0_8px_rgba(185,151,255,0.6)]", className)}
      {...props}
    >
      <defs>
        <radialGradient id="silvi-ico-grad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ff9efa" />
          <stop offset="50%" stopColor="#b997ff" />
          <stop offset="100%" stopColor="#6b13f5" />
        </radialGradient>
      </defs>

      {/* Orbit Ring */}
      <ellipse cx="12" cy="12" rx="10.5" ry="4" stroke="#b997ff" strokeWidth="1" opacity="0.4" transform="rotate(-20 12 12)" />

      {/* Core Orb */}
      <circle cx="12" cy="12" r="8" fill="url(#silvi-ico-grad)" stroke="#ffffff" strokeWidth="0.75" />

      {/* Specular Highlight */}
      <ellipse cx="9.5" cy="8.5" rx="3.5" ry="2" fill="#ffffff" opacity="0.6" transform="rotate(-15 9.5 8.5)" />

      {/* Facial Eyes */}
      <circle cx="10" cy="12" r="1" fill="#ffffff" />
      <circle cx="14" cy="12" r="1" fill="#ffffff" />
      <path d="M 11 14.5 Q 12 15.5 13 14.5" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
