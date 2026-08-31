import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Doppler Brand Signature Asterisk Icon
 */
export function DopplerAsteriskIcon({ size = 20, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Doppler Asterisk"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <line x1="12" y1="2" x2="12" y2="22" stroke="#b997ff" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="3.3" y1="7" x2="20.7" y2="17" stroke="#b997ff" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="3.3" y1="17" x2="20.7" y2="7" stroke="#b997ff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="#00f575" />
    </svg>
  );
}

/**
 * Cyber Beam Upload / Ingestion Icon
 */
export function CyberUploadIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Cyber Upload"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 4 17 V 19 A 2 2 0 0 0 6 21 H 18 A 2 2 0 0 0 20 19 V 17" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 12 3 L 12 15" stroke="#00f575" strokeWidth="2" strokeLinecap="round" />
      <path d="M 7 8 L 12 3 L 17 8" stroke="#00f575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Monospace Terminal Prompt Icon
 */
export function TerminalPromptIcon({ size = 20, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Terminal Prompt"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 4 7 L 10 12 L 4 17" stroke="#00f575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="17" x2="20" y2="17" stroke="#b997ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
