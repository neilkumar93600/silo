import * as React from "react";
import { cn } from "@/lib/utils";
import { LogoIcon } from "./logo-icon";
import type { BaseIconProps, LogoVariant } from "../types";

export interface LogoBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  variant?: LogoVariant;
  glow?: boolean;
  shape?: "squircle" | "circle";
}

/**
 * App Icon Badge container with Apple macOS/iOS squircle and subtle ambient glow
 */
export function LogoBadge({
  size = 48,
  variant = "color",
  glow = false,
  shape = "squircle",
  className,
  ...props
}: LogoBadgeProps) {
  const isCircle = shape === "circle";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none overflow-hidden bg-[#18181b] border border-parchment-shadow shadow-harvest-sm",
        isCircle ? "rounded-full" : "rounded-[22%]",
        glow && "shadow-harvest-lg",
        className
      )}
      {...props}
    >
      <div className="size-full flex items-center justify-center p-[12%]">
        <LogoIcon size={size} variant={variant} />
      </div>
    </div>
  );
}
