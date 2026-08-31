import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Brand Asterisk Starburst Icon
 */
export function DopplerAsteriskIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Asterisk"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="3.34" y1="7" x2="20.66" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="3.34" y1="17" x2="20.66" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Cyber Upload Arrow Icon
 */
export function CyberUploadIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Upload"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 4 17 V 19 C 4 20.1 4.9 21 6 21 H 18 C 19.1 21 20 20.1 20 19 V 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 12 3 L 6 9 M 12 3 L 18 9 M 12 3 V 15" stroke="#fa5d00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Terminal Command Prompt Icon
 */
export function TerminalPromptIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Terminal"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M 6 9 L 10 12 L 6 15" stroke="#fa5d00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="16" y2="15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
