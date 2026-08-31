import * as React from "react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "./logo-icon";
import type { LogoProps } from "../types";

export function Logo({
  size = 24,
  variant = "color",
  withBackground = false,
  bgType = "squircle",
  className,
  ...props
}: LogoProps) {
  if (!withBackground) {
    return <LogoIcon size={size} variant={variant} className={className} {...props} />;
  }

  const isCircle = bgType === "circle";
  const numSize = typeof size === "number" ? size : parseInt(String(size), 10) || 40;
  const padding = Math.max(4, Math.round(numSize * 0.15));

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative shrink-0 flex items-center justify-center bg-gradient-to-b from-[#231b2e] via-[#1c1624] to-[#120e18] border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.5)] overflow-hidden",
        isCircle ? "rounded-full" : "rounded-2xl",
        className
      )}
    >
      <div
        className="size-full flex items-center justify-center"
        style={{ padding }}
      >
        <LogoIcon variant={variant} className="size-full" {...props} />
      </div>
    </div>
  );
}
