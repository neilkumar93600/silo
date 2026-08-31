import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Vault PDF File Icon with micro-badge
 */
export function VaultFilePdfIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="PDF File"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 4 4 A 2 2 0 0 1 6 2 L 14 2 L 20 8 L 20 20 A 2 2 0 0 1 18 22 L 6 22 A 2 2 0 0 1 4 20 Z" stroke="#ff5632" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M 14 2 V 8 H 20" stroke="#ff5632" strokeWidth="1.5" />
      <rect x="7" y="13" width="10" height="5" rx="1" fill="#ff5632" fillOpacity="0.2" stroke="#ff5632" strokeWidth="1" />
      <text x="8.2" y="16.8" fill="#ff5632" fontSize="3.5" fontWeight="bold" fontFamily="monospace">PDF</text>
    </svg>
  );
}

/**
 * Vault Media/Image Icon
 */
export function VaultFileMediaIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Media File"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#ff9efa" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2" fill="#ff9efa" />
      <path d="M 3 17 L 8 12 L 13 17 L 16 14 L 21 19" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Vault Code / Script Icon
 */
export function VaultFileCodeIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Code File"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 4 4 A 2 2 0 0 1 6 2 L 14 2 L 20 8 L 20 20 A 2 2 0 0 1 18 22 L 6 22 A 2 2 0 0 1 4 20 Z" stroke="#00f575" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M 14 2 V 8 H 20" stroke="#00f575" strokeWidth="1.5" />
      <path d="M 8.5 13.5 L 6.5 15.5 L 8.5 17.5" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 15.5 13.5 L 17.5 15.5 L 15.5 17.5" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="13" y1="13" x2="11" y2="18" stroke="#b997ff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Vault Compressed Archive Icon (ZIP/TAR)
 */
export function VaultFileZipIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Archive File"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 4 4 A 2 2 0 0 1 6 2 L 14 2 L 20 8 L 20 20 A 2 2 0 0 1 18 22 L 6 22 A 2 2 0 0 1 4 20 Z" stroke="#b997ff" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M 14 2 V 8 H 20" stroke="#b997ff" strokeWidth="1.5" />
      {/* Zipper teeth */}
      <line x1="10" y1="6" x2="12" y2="6" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="8" x2="14" y2="8" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="10" x2="12" y2="10" stroke="#b997ff" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="10" y="13" width="4" height="4" rx="0.75" fill="#2d2734" stroke="#00f575" strokeWidth="1" />
    </svg>
  );
}

/**
 * Vault Spreadsheet Icon (XLSX / CSV)
 */
export function VaultFileSheetIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Spreadsheet File"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 4 4 A 2 2 0 0 1 6 2 L 14 2 L 20 8 L 20 20 A 2 2 0 0 1 18 22 L 6 22 A 2 2 0 0 1 4 20 Z" stroke="#00f575" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M 14 2 V 8 H 20" stroke="#00f575" strokeWidth="1.5" />
      <rect x="7" y="11" width="10" height="8" rx="1" stroke="#00f575" strokeWidth="1" />
      <line x1="12" y1="11" x2="12" y2="19" stroke="#00f575" strokeWidth="1" />
      <line x1="7" y1="15" x2="17" y2="15" stroke="#00f575" strokeWidth="1" />
    </svg>
  );
}
