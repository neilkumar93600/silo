import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps, LogoVariant } from "../types";

export interface LogoIconProps extends BaseIconProps {
  variant?: LogoVariant;
}

/**
 * Pure Silo Cloud-Pin Logo Mark with Subsurface Frosted Glass Shading
 */
export function LogoIcon({
  size = 24,
  variant = "color",
  className,
  ...props
}: LogoIconProps) {
  const isWhite = variant === "white" || variant === "monochrome";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      fill="none"
      aria-label="Silo Mark"
      role="img"
      style={size ? { width: size, height: size } : undefined}
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <defs>
        {/* Left Lobe (Purple / Magenta / Fuchsia Aurora) */}
        <linearGradient id="silo-icon-leftGrad" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="25%" stopColor="#9333ea" />
          <stop offset="50%" stopColor="#c026d3" />
          <stop offset="80%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>

        <radialGradient id="silo-icon-leftGlow" cx="38%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#d946ef" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#a21caf" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-leftRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fda4af" stopOpacity="0.95" />
        </linearGradient>

        {/* Right Lobe (Cyan / Teal / Mint Emerald) */}
        <linearGradient id="silo-icon-rightGrad" x1="15%" y1="15%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="25%" stopColor="#06b6d4" />
          <stop offset="55%" stopColor="#14b8a6" />
          <stop offset="85%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>

        <radialGradient id="silo-icon-rightGlow" cx="62%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#2dd4bf" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#0d9488" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-rightRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.95" />
        </linearGradient>

        {/* Frosted Glass Pin */}
        <linearGradient id="silo-icon-pinBody" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="20%" stopColor="#e8ecf1" stopOpacity="0.94" />
          <stop offset="45%" stopColor="#cbd5e1" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#94a3b8" stopOpacity="0.55" />
          <stop offset="92%" stopColor="#cbd5e1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>

        <radialGradient id="silo-icon-pinDome" cx="50%" cy="26%" r="48%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-pinRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {isWhite ? (
        <g id="silo-icon-white">
          <path
            d="M 512 778 L 305 778 C 190 778 120 682 120 560 C 120 438 212 372 328 372 C 400 372 462 408 498 468 L 512 505 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M 512 778 L 719 778 C 834 778 904 682 904 560 C 904 438 812 372 696 372 C 624 372 562 408 526 468 L 512 505 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M 512 778 C 460 706 322 530 322 388 C 322 278 406 188 512 188 C 618 188 702 278 702 388 C 702 530 564 706 512 778 Z"
            fill="currentColor"
            opacity="0.95"
          />
        </g>
      ) : (
        <g id="silo-icon-color">
          {/* Left Lobe */}
          <path
            d="M 512 778 L 305 778 C 190 778 120 682 120 560 C 120 438 212 372 328 372 C 400 372 462 408 498 468 L 512 505 Z"
            fill="url(#silo-icon-leftGrad)"
          />
          <path
            d="M 512 778 L 305 778 C 190 778 120 682 120 560 C 120 438 212 372 328 372 C 400 372 462 408 498 468 L 512 505 Z"
            fill="url(#silo-icon-leftGlow)"
          />
          <path
            d="M 512 778 L 305 778 C 190 778 120 682 120 560 C 120 438 212 372 328 372 C 400 372 462 408 498 468"
            fill="none"
            stroke="url(#silo-icon-leftRim)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Right Lobe */}
          <path
            d="M 512 778 L 719 778 C 834 778 904 682 904 560 C 904 438 812 372 696 372 C 624 372 562 408 526 468 L 512 505 Z"
            fill="url(#silo-icon-rightGrad)"
          />
          <path
            d="M 512 778 L 719 778 C 834 778 904 682 904 560 C 904 438 812 372 696 372 C 624 372 562 408 526 468 L 512 505 Z"
            fill="url(#silo-icon-rightGlow)"
          />
          <path
            d="M 512 778 L 719 778 C 834 778 904 682 904 560 C 904 438 812 372 696 372 C 624 372 562 408 526 468"
            fill="none"
            stroke="url(#silo-icon-rightRim)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Frosted Glass Pin */}
          <path
            d="M 512 778 C 460 706 322 530 322 388 C 322 278 406 188 512 188 C 618 188 702 278 702 388 C 702 530 564 706 512 778 Z"
            fill="url(#silo-icon-pinBody)"
            stroke="url(#silo-icon-pinRim)"
            strokeWidth="4"
          />
          <path
            d="M 512 778 C 460 706 322 530 322 388 C 322 278 406 188 512 188 C 618 188 702 278 702 388 C 702 530 564 706 512 778 Z"
            fill="url(#silo-icon-pinDome)"
          />
          <path
            d="M 512 778 C 485 738 410 636 390 560 C 425 615 470 690 512 778 Z"
            fill="url(#silo-icon-leftGrad)"
            opacity="0.38"
          />
          <path
            d="M 512 778 C 539 738 614 636 634 560 C 599 615 554 690 512 778 Z"
            fill="url(#silo-icon-rightGrad)"
            opacity="0.38"
          />
        </g>
      )}
    </svg>
  );
}
