"use client";

import * as React from "react";
import { SilviOrb, type ExtendedSilviStatus } from "@/components/assistant/silvi-orb";
import { cn } from "@/lib/utils";
import type { SilviIconProps, SilviMood } from "../types";

export function SilviAvatar({
  size = 48,
  mood = "idle",
  glow = true,
  className,
  ...props
}: SilviIconProps) {
  // Map SilviMood to ExtendedSilviStatus
  const status: ExtendedSilviStatus =
    mood === "happy" ? "success" : (mood === "alert" ? "checking" : (mood === "sleepy" ? "idle" : (mood as ExtendedSilviStatus)));

  const numSize = typeof size === "number" ? size : parseInt(String(size), 10) || 48;

  return (
    <div
      className={cn("inline-flex items-center justify-center shrink-0 select-none", className)}
      {...props}
    >
      <SilviOrb
        status={status}
        size={numSize}
        showGlow={glow}
        showRings={true}
        interactive={true}
      />
    </div>
  );
}
