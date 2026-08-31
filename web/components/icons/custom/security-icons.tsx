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
      width={size}
      height={size}
      aria-label="Zero-Knowledge Key"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <circle cx="7.5" cy="15.5" r="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="7.5" cy="15.5" r="1.5" fill="currentColor" />
      <path d="M 11 12 L 20 3 M 16 7 L 19 10 M 18 5 L 21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Shield Check Glow Icon
 */
export function ShieldCheckGlowIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Shield Check"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M 12 2 L 4 5 L 4 11.5 C 4 16.5 7.4 21.1 12 22 C 16.6 21.1 20 16.5 20 11.5 L 20 5 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M 8.5 11.5 L 11 14 L 15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      width={size}
      height={size}
      aria-label="Revocable Link"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 10 13 A 5 5 0 0 0 17 13 L 19 11 A 5 5 0 0 0 12 4 L 10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 14 11 A 5 5 0 0 0 7 11 L 5 13 A 5 5 0 0 0 12 20 L 14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="3" y1="3" x2="21" y2="21" stroke="#fa5d00" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Direct Grant Access Icon
 */
export function DirectGrantIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Direct Grant"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 16 21 V 19 C 16 16.79 14.21 15 12 15 D 8 15 C 5.79 15 4 16.79 4 19 V 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="11" r="3" stroke="#fa5d00" strokeWidth="1.5" />
      <path d="M 18 9.5 V 12.5 M 16.5 11 H 19.5" stroke="#fa5d00" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Biometric Fingerprint Auth Icon
 */
export function FingerprintAuthIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Fingerprint Auth"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 12 2 C 7.5 2 4 5.5 4 10 C 4 14.5 7 18 12 21 C 17 18 20 14.5 20 10 C 20 5.5 16.5 2 12 2 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 8 10 C 8 7.8 9.8 6 12 6 C 14.2 6 16 7.8 16 10 C 16 13 14 16 12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 12 10 V 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
