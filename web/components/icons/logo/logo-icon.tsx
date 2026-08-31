import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps, LogoVariant } from "../types";

export interface LogoIconProps extends BaseIconProps {
  variant?: LogoVariant;
}

/**
 * Pure Silo Cloud-Pin Logo Mark
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
        {/* Left Bulb (Neon Violet -> Lavender Spark -> Plasma Pink) */}
        <linearGradient id="silo-icon-violetBase" x1="5%" y1="15%" x2="95%" y2="90%">
          <stop offset="0%" stopColor="#4c0ca8" />
          <stop offset="30%" stopColor="#6b13f5" />
          <stop offset="65%" stopColor="#9333ea" />
          <stop offset="85%" stopColor="#b997ff" />
          <stop offset="100%" stopColor="#ff9efa" />
        </linearGradient>

        <radialGradient id="silo-icon-violetGlow" cx="36%" cy="48%" r="60%">
          <stop offset="0%" stopColor="#ff9efa" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#b997ff" stopOpacity="0.8" />
          <stop offset="75%" stopColor="#6b13f5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4c0ca8" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-violetStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9efa" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#b997ff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.95" />
        </linearGradient>

        {/* Right Bulb (Signal Green) */}
        <linearGradient id="silo-icon-greenBase" x1="10%" y1="15%" x2="95%" y2="90%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="25%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="80%" stopColor="#00f575" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>

        <radialGradient id="silo-icon-greenGlow" cx="64%" cy="48%" r="60%">
          <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#00f575" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#059669" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-greenStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#00f575" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.95" />
        </linearGradient>

        {/* Frosted Glass Pin */}
        <linearGradient id="silo-icon-glassBody" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#f1f0ec" stopOpacity="0.98" />
          <stop offset="25%" stopColor="#e5e7eb" stopOpacity="0.92" />
          <stop offset="55%" stopColor="#d0c9c4" stopOpacity="0.80" />
          <stop offset="80%" stopColor="#a5a2a5" stopOpacity="0.52" />
          <stop offset="95%" stopColor="#d0c9c4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f1f0ec" stopOpacity="0.88" />
        </linearGradient>

        <radialGradient id="silo-icon-pinDome" cx="50%" cy="28%" r="48%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#f1f0ec" stopOpacity="0.35" />
          <stop offset="85%" stopColor="#f1f0ec" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-pinRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#f1f0ec" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {isWhite ? (
        <g id="silo-icon-white">
          <path
            d="M 512 775 L 310 775 C 195 775 125 680 125 560 C 125 440 215 375 330 375 C 400 375 460 410 496 470 L 512 505 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M 512 775 L 714 775 C 829 775 899 680 899 560 C 899 440 809 375 694 375 C 624 375 564 410 528 470 L 512 505 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M 512 775 C 460 705 325 530 325 390 C 325 280 408 190 512 190 C 616 190 699 280 699 390 C 699 530 564 705 512 775 Z"
            fill="currentColor"
            opacity="0.95"
          />
        </g>
      ) : (
        <g id="silo-icon-color">
          {/* Left Bulb */}
          <path
            d="M 512 775 L 310 775 C 195 775 125 680 125 560 C 125 440 215 375 330 375 C 400 375 460 410 496 470 L 512 505 Z"
            fill="url(#silo-icon-violetBase)"
          />
          <path
            d="M 512 775 L 310 775 C 195 775 125 680 125 560 C 125 440 215 375 330 375 C 400 375 460 410 496 470 L 512 505 Z"
            fill="url(#silo-icon-violetGlow)"
          />
          <path
            d="M 512 775 L 310 775 C 195 775 125 680 125 560 C 125 440 215 375 330 375 C 400 375 460 410 496 470"
            fill="none"
            stroke="url(#silo-icon-violetStroke)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Right Bulb */}
          <path
            d="M 512 775 L 714 775 C 829 775 899 680 899 560 C 899 440 809 375 694 375 C 624 375 564 410 528 470 L 512 505 Z"
            fill="url(#silo-icon-greenBase)"
          />
          <path
            d="M 512 775 L 714 775 C 829 775 899 680 899 560 C 899 440 809 375 694 375 C 624 375 564 410 528 470 L 512 505 Z"
            fill="url(#silo-icon-greenGlow)"
          />
          <path
            d="M 512 775 L 714 775 C 829 775 899 680 899 560 C 899 440 809 375 694 375 C 624 375 564 410 528 470"
            fill="none"
            stroke="url(#silo-icon-greenStroke)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Frosted Glass Pin */}
          <path
            d="M 512 775 C 460 705 325 530 325 390 C 325 280 408 190 512 190 C 616 190 699 280 699 390 C 699 530 564 705 512 775 Z"
            fill="url(#silo-icon-glassBody)"
            stroke="url(#silo-icon-pinRim)"
            strokeWidth="4"
          />
          <path
            d="M 512 775 C 460 705 325 530 325 390 C 325 280 408 190 512 190 C 616 190 699 280 699 390 C 699 530 564 705 512 775 Z"
            fill="url(#silo-icon-pinDome)"
          />
          <path
            d="M 512 775 C 485 735 410 635 390 560 C 425 615 470 690 512 775 Z"
            fill="url(#silo-icon-violetBase)"
            opacity="0.38"
          />
          <path
            d="M 512 775 C 539 735 614 635 634 560 C 599 615 554 690 512 775 Z"
            fill="url(#silo-icon-greenBase)"
            opacity="0.38"
          />
        </g>
      )}
    </svg>
  );
}
