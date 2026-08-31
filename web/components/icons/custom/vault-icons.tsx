import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Vault Safe Icon
 */
export function VaultIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Vault"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <rect x="2" y="3" width="20" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M 12 7.5 L 12 9.5 M 12 14.5 L 12 16.5 M 7.5 12 L 9.5 12 M 14.5 12 L 16.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="7" r="1" fill="currentColor" />
      <circle cx="18" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * Folder Vault with Lock Icon
 */
export function FolderVaultIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Folder Vault"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M 3 7 C 3 5.34 4.34 4 6 4 L 9.5 4 C 10.5 4 11.4 4.5 12 5.3 L 13.2 6.9 C 13.6 7.4 14.2 7.7 14.8 7.7 L 18 7.7 C 19.66 7.7 21 9.04 21 10.7 L 21 18 C 21 19.66 19.66 21 18 21 L 6 21 C 4.34 21 3 19.66 3 18 Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="9" y="12" width="6" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 10.5 12 L 10.5 10.5 C 10.5 9.67 11.17 9 12 9 C 12.83 9 13.5 9.67 13.5 10.5 L 13.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Encrypted Cloud Sync Icon
 */
export function CloudSyncIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Cloud Sync"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M 6.5 19 C 4.01 19 2 16.99 2 14.5 C 2 12.22 3.7 10.33 5.94 10.04 C 6.47 6.61 9.43 4 13 4 C 17.08 4 20.45 7.15 20.94 11.16 C 21.56 11.66 22 12.43 22 13.3 C 22 14.8 20.8 16 19.3 16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M 12 13 L 15 16 L 9 16 Z" fill="currentColor" />
      <path d="M 12 16 L 12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Encrypted Storage Gauge Icon
 */
export function StorageGaugeIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      aria-label="Storage Gauge"
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path d="M 4 17 C 3.37 15.5 3 13.8 3 12 C 3 7.03 7.03 3 12 3 C 16.97 3 21 7.03 21 12 C 21 13.8 20.63 15.5 20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 12 12 L 16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
