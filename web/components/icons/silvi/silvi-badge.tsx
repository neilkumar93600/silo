import * as React from "react";
import { cn } from "@/lib/utils";
import { SilviAvatar } from "./silvi-avatar";
import type { SilviMood } from "../types";

export interface SilviBadgeProps {
  mood?: SilviMood;
  label?: string;
  statusText?: string;
  className?: string;
  onClick?: () => void;
}

export function SilviBadge({
  mood = "idle",
  label = "Silvi",
  statusText,
  className,
  onClick,
}: SilviBadgeProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#2d2734]/80 px-3 py-1.5 backdrop-blur-md transition-all select-none",
        onClick && "cursor-pointer hover:border-[#b997ff]/40 hover:bg-[#3a3340]",
        className
      )}
    >
      <SilviAvatar size={22} mood={mood} glow={false} />
      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-[#f1f0ec]">{label}</span>
        {statusText && (
          <>
            <span className="text-white/20">·</span>
            <span className="font-mono text-[11px] text-[#a5a2a5]">{statusText}</span>
          </>
        )}
      </div>
      <span className="size-1.5 rounded-full bg-[#00f575] shadow-[0_0_6px_#00f575] animate-pulse" />
    </div>
  );
}
