import * as React from "react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "./logo-icon";
import type { IconSize } from "../types";

export interface LogoBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: IconSize;
  glow?: boolean;
  borderPulse?: boolean;
}

export function LogoBadge({
  size = 48,
  glow = true,
  borderPulse = false,
  className,
  style,
  ...props
}: LogoBadgeProps) {
  const numSize = typeof size === "number" ? size : parseInt(String(size), 10) || 48;
  const pad = Math.max(6, Math.round(numSize * 0.16));

  return (
    <div
      style={{ width: size, height: size, ...style }}
      className={cn(
        "relative shrink-0 select-none flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#251e30] via-[#1c1624] to-[#120e18] border border-white/15 p-2 shadow-[0_12px_28px_rgba(0,0,0,0.6)]",
        glow && "shadow-[0_0_30px_rgba(185,151,255,0.18)]",
        borderPulse && "animate-pulse border-[#b997ff]/40",
        className
      )}
      {...props}
    >
      <div className="size-full flex items-center justify-center" style={{ padding: pad }}>
        <LogoIcon className="size-full" />
      </div>
    </div>
  );
}
