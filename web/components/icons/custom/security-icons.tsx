import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Zero-Knowledge Cryptographic Key Icon
 */
export function ZeroKnowledgeKeyIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Zero Knowledge Key"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      {/* Outer Key Ring */}
      <circle cx="8" cy="8" r="5" stroke="#b997ff" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" fill="#00f575" />
      {/* Key Shaft */}
      <path d="M 12 12 L 20 20" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" />
      {/* Key Bit Teeth */}
      <path d="M 18 18 L 21 15" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 15 15 L 17 13" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Glowing Security Shield with Checkmark
 */
export function ShieldCheckGlowIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Shield Check"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M 12 2 L 20 5.5 V 11 C 20 16.5 16.5 20.5 12 22 C 7.5 20.5 4 16.5 4 11 V 5.5 Z"
        stroke="#b997ff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Signal Green Check */}
      <path
        d="M 8.5 11.5 L 11 14 L 15.5 9"
        stroke="#00f575"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Revocable Timed Link Icon
 */
export function RevocableLinkIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Revocable Link"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      {/* Link 1 */}
      <path
        d="M 10 13 A 4 4 0 0 0 14 9 L 17 6 A 4 4 0 0 0 11.3 0.3 L 8.5 3"
        stroke="#b997ff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Link 2 */}
      <path
        d="M 14 11 A 4 4 0 0 0 10 15 L 7 18 A 4 4 0 0 0 12.7 23.7 L 15.5 21"
        stroke="#b997ff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Center Link Pulse Bar */}
      <line x1="8" y1="16" x2="16" y2="8" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Direct Grant / Encrypted Handoff Icon
 */
export function DirectGrantIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Direct Grant"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <circle cx="7" cy="12" r="3.5" stroke="#b997ff" strokeWidth="1.5" />
      <circle cx="17" cy="12" r="3.5" stroke="#00f575" strokeWidth="1.5" />
      <path d="M 10.5 12 L 13.5 12" stroke="#f1f0ec" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" />
      <path d="M 12 10.5 L 13.5 12 L 12 13.5" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Biometric Cyber Fingerprint Auth Icon
 */
export function FingerprintAuthIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Fingerprint Auth"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 12 2 A 9 9 0 0 0 3 11 C 3 14 4.5 18 6 20" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 21 11 A 9 9 0 0 0 12 2" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 18 19 C 19.5 17 21 14 21 11" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 7 11 A 5 5 0 0 1 17 11 C 17 15 15.5 19 14.5 21" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 10 11 A 2 2 0 0 1 14 11 C 14 14 12.5 18 11.5 22" stroke="#ff9efa" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
