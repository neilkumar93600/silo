import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps } from "../types";

/**
 * Encrypted Vault Safe Box Icon
 */
export function VaultIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Vault Icon"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="#b997ff" strokeWidth="1.5" />
      <rect x="5" y="6" width="14" height="12" rx="1.5" stroke="#e5e7eb" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="12" cy="12" r="3.5" stroke="#00f575" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="#00f575" />
      <line x1="12" y1="8.5" x2="12" y2="7" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15.5" y1="12" x2="17" y2="12" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="15.5" x2="12" y2="17" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8.5" y1="12" x2="7" y2="12" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6" cy="7" r="0.75" fill="#b997ff" />
      <circle cx="18" cy="7" r="0.75" fill="#b997ff" />
      <circle cx="6" cy="17" r="0.75" fill="#b997ff" />
      <circle cx="18" cy="17" r="0.75" fill="#b997ff" />
    </svg>
  );
}

/**
 * Encrypted Folder Vault Icon
 */
export function FolderVaultIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Folder Vault Icon"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M 3 7 A 2 2 0 0 1 5 5 L 9 5 A 2 2 0 0 1 10.5 5.7 L 12 7 L 19 7 A 2 2 0 0 1 21 9 L 21 17 A 2 2 0 0 1 19 19 L 5 19 A 2 2 0 0 1 3 17 Z"
        stroke="#b997ff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Front flap with micro-line */}
      <path d="M 3 10 L 21 10" stroke="#e5e7eb" strokeOpacity="0.2" strokeWidth="1" />
      {/* Embedded Mini Lock */}
      <rect x="10.5" y="11.5" width="5" height="4" rx="1" fill="#2d2734" stroke="#00f575" strokeWidth="1" />
      <path d="M 12 11.5 V 10 C 12 9.4 12.4 9 13 9 C 13.6 9 14 9.4 14 10 V 11.5" stroke="#00f575" strokeWidth="1" />
      <circle cx="13" cy="13.5" r="0.5" fill="#00f575" />
    </svg>
  );
}

/**
 * Cloud Sync Encrypted Stream Icon
 */
export function CloudSyncIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Cloud Sync Icon"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M 6.5 17 A 4.5 4.5 0 0 1 6.5 8 A 6 6 0 0 1 17.5 7 A 5 5 0 0 1 17.5 17 Z"
        stroke="#b997ff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sync arrows in center */}
      <path d="M 10 12 L 12 10 L 14 12" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 12 10 V 15" stroke="#00f575" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Storage Gauge Meter Icon
 */
export function StorageGaugeIcon({ size = 24, className, ...props }: BaseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Storage Gauge Icon"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <path
        d="M 4 16 A 8 8 0 1 1 20 16"
        stroke="#55505b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 4 16 A 8 8 0 0 1 14 8.5"
        stroke="#00f575"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15" r="2" fill="#b997ff" />
      <line x1="12" y1="15" x2="15" y2="10" stroke="#f1f0ec" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
