import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Vault PDF File Document Icon
 */
export function VaultFilePdfIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="PDF File"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 14 2 H 6 C 4.9 2 4 2.9 4 4 V 20 C 4 21.1 4.9 22 6 22 H 18 C 19.1 22 20 21.1 20 20 V 8 Z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M 14 2 V 8 H 20" stroke="currentColor" strokeWidth="1.75" />
      <rect x="7" y="13" width="10" height="5" rx="1" fill="#fa5d00" fillOpacity="0.2" stroke="#fa5d00" strokeWidth="1" />
      <text x="12" y="16.5" textAnchor="middle" fill="#fa5d00" fontSize="3.5" fontWeight="bold" fontFamily="monospace">PDF</text>
    </svg>
  );
}

/**
 * Vault Media File Icon
 */
export function VaultFileMediaIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Media File"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 14 2 H 6 C 4.9 2 4 2.9 4 4 V 20 C 4 21.1 4.9 22 6 22 H 18 C 19.1 22 20 21.1 20 20 V 8 Z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M 14 2 V 8 H 20" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <path d="M 8 18 L 11 14 L 14 17 L 16 15 L 18 18 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/**
 * Vault Code Script Icon
 */
export function VaultFileCodeIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Code File"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 14 2 H 6 C 4.9 2 4 2.9 4 4 V 20 C 4 21.1 4.9 22 6 22 H 18 C 19.1 22 20 21.1 20 20 V 8 Z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M 14 2 V 8 H 20" stroke="currentColor" strokeWidth="1.75" />
      <path d="M 9.5 13 L 7.5 15 L 9.5 17" stroke="#fa5d00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 14.5 13 L 16.5 15 L 14.5 17" stroke="#fa5d00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Vault Zip Archive Icon
 */
export function VaultFileZipIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Zip File"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 14 2 H 6 C 4.9 2 4 2.9 4 4 V 20 C 4 21.1 4.9 22 6 22 H 18 C 19.1 22 20 21.1 20 20 V 8 Z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M 14 2 V 8 H 20" stroke="currentColor" strokeWidth="1.75" />
      <path d="M 10 7 H 12 M 10 9 H 12 M 10 11 H 12 M 10 13 H 12" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="15" width="3" height="4" rx="0.5" fill="#fa5d00" stroke="#fa5d00" strokeWidth="1" />
    </svg>
  );
}

/**
 * Vault Spreadsheet Sheet Icon
 */
export function VaultFileSheetIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Spreadsheet File"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 14 2 H 6 C 4.9 2 4 2.9 4 4 V 20 C 4 21.1 4.9 22 6 22 H 18 C 19.1 22 20 21.1 20 20 V 8 Z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M 14 2 V 8 H 20" stroke="currentColor" strokeWidth="1.75" />
      <rect x="7" y="12" width="10" height="7" stroke="currentColor" strokeWidth="1" />
      <line x1="7" y1="15.5" x2="17" y2="15.5" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="12" x2="12" y2="19" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
