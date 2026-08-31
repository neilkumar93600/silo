"use client";

import * as React from "react";
import { SilviOrb } from "@/components/assistant/silvi-orb";
import { cn } from "@/lib/utils";
import type { IconSize } from "../types";

export interface SilviIconGlyphProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: IconSize;
  glow?: boolean;
}

/**
 * Compact Silvi AI Mascot icon glyph based on the original plasma orb design
 */
export function SilviIcon({
  size = 20,
  glow = false,
  className,
  ...props
}: SilviIconGlyphProps) {
  const numSize = typeof size === "number" ? size : parseInt(String(size), 10) || 20;

  return (
    <div
      className={cn("inline-flex items-center justify-center shrink-0 select-none", className)}
      {...props}
    >
      <SilviOrb
        status="idle"
        size={numSize}
        showGlow={glow}
        showRings={false}
        interactive={false}
      />
    </div>
  );
}
