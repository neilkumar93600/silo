import * as React from "react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "./logo-icon";
import type { LogoProps } from "../types";

/**
 * Master Logo component
 * Supports standalone vector rendering, squircle container, circle container, and monochrome modes.
 */
export function Logo({
  size = 32,
  variant = "color",
  withBackground = false,
  bgType = "squircle",
  className,
  ...props
}: LogoProps) {
  if (!withBackground) {
    return <LogoIcon size={size} variant={variant} className={className} />;
  }

  const bgRadius = bgType === "circle" ? "rounded-full" : "rounded-[22%]";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none overflow-hidden bg-[#18181b] border border-parchment-shadow shadow-sm",
        bgRadius,
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center p-[10%]">
        <LogoIcon size={size} variant={variant} />
      </div>
    </div>
  );
}
