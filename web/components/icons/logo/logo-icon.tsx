import * as React from "react";
import { cn } from "@/lib/utils";
import type { BaseIconProps, LogoVariant } from "../types";

export interface LogoIconProps extends BaseIconProps {
  variant?: LogoVariant;
}

/**
 * Silo Cloud-Pin Logo Mark
 * Featuring asymmetrical cloud lobes (larger left purple-fuchsia puff, smaller right cyan-mint capsule)
 * and a center volumetric frosted glass teardrop pin.
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
        {/* Left Lobe (Larger & Taller Purple-Fuchsia Cloud Puff) */}
        <linearGradient id="silo-icon-leftGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#7033ea" />
          <stop offset="30%" stopColor="#9333ea" />
          <stop offset="60%" stopColor="#c026d3" />
          <stop offset="85%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>

        <radialGradient id="silo-icon-leftGlow" cx="35%" cy="52%" r="55%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#d946ef" stopOpacity="0.8" />
          <stop offset="75%" stopColor="#a21caf" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-leftRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#ec4899" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fda4af" stopOpacity="0.95" />
        </linearGradient>

        {/* Right Lobe (Smaller & Lower Cyan-Mint Capsule) */}
        <linearGradient id="silo-icon-rightGrad" x1="15%" y1="15%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="25%" stopColor="#06b6d4" />
          <stop offset="55%" stopColor="#14b8a6" />
          <stop offset="85%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>

        <radialGradient id="silo-icon-rightGlow" cx="72%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#2dd4bf" stopOpacity="0.8" />
          <stop offset="75%" stopColor="#0d9488" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-rightRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.95" />
        </linearGradient>

        {/* Frosted Glass Pin */}
        <linearGradient id="silo-icon-pinBody" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.99" />
          <stop offset="22%" stopColor="#eaedf2" stopOpacity="0.96" />
          <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.88" />
          <stop offset="72%" stopColor="#94a3b8" stopOpacity="0.65" />
          <stop offset="90%" stopColor="#cbd5e1" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.92" />
        </linearGradient>

        <radialGradient id="silo-icon-pinDome" cx="50%" cy="24%" r="48%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="silo-icon-pinRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>

        <clipPath id="silo-icon-pinClip">
          <path
            d="M 552 778
               C 490 706 332 525 332 388
               C 332 270 430 198 552 198
               C 674 198 772 270 772 388
               C 772 525 614 706 552 778
               Z"
          />
        </clipPath>
      </defs>

      {isWhite ? (
        <g id="silo-icon-white">
          <path
            d="M 552 778 L 305 778 C 185 778 130 686 130 568 C 130 435 220 388 335 388 C 415 388 478 430 520 495 L 552 538 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M 552 778 L 735 778 C 830 778 872 705 872 612 C 872 522 815 492 730 492 C 660 492 602 532 570 580 L 552 612 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M 552 778 C 490 706 332 525 332 388 C 332 270 430 198 552 198 C 674 198 772 270 772 388 C 772 525 614 706 552 778 Z"
            fill="currentColor"
            opacity="0.95"
          />
        </g>
      ) : (
        <g id="silo-icon-color">
          {/* Left Lobe: Bigger & Taller Puff */}
          <path
            d="M 552 778 L 305 778 C 185 778 130 686 130 568 C 130 435 220 388 335 388 C 415 388 478 430 520 495 L 552 538 Z"
            fill="url(#silo-icon-leftGrad)"
          />
          <path
            d="M 552 778 L 305 778 C 185 778 130 686 130 568 C 130 435 220 388 335 388 C 415 388 478 430 520 495 L 552 538 Z"
            fill="url(#silo-icon-leftGlow)"
          />
          <path
            d="M 552 778 L 305 778 C 185 778 130 686 130 568 C 130 435 220 388 335 388 C 415 388 478 430 520 495"
            fill="none"
            stroke="url(#silo-icon-leftRim)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Right Lobe: Smaller & Lower Capsule */}
          <path
            d="M 552 778 L 735 778 C 830 778 872 705 872 612 C 872 522 815 492 730 492 C 660 492 602 532 570 580 L 552 612 Z"
            fill="url(#silo-icon-rightGrad)"
          />
          <path
            d="M 552 778 L 735 778 C 830 778 872 705 872 612 C 872 522 815 492 730 492 C 660 492 602 532 570 580 L 552 612 Z"
            fill="url(#silo-icon-rightGlow)"
          />
          <path
            d="M 552 778 L 735 778 C 830 778 872 705 872 612 C 872 522 815 492 730 492 C 660 492 602 532 570 580"
            fill="none"
            stroke="url(#silo-icon-rightRim)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Frosted Glass Pin */}
          <path
            d="M 552 778 C 490 706 332 525 332 388 C 332 270 430 198 552 198 C 674 198 772 270 772 388 C 772 525 614 706 552 778 Z"
            fill="url(#silo-icon-pinBody)"
            stroke="url(#silo-icon-pinRim)"
            strokeWidth="4"
          />
          <path
            d="M 552 778 C 490 706 332 525 332 388 C 332 270 430 198 552 198 C 674 198 772 270 772 388 C 772 525 614 706 552 778 Z"
            fill="url(#silo-icon-pinDome)"
          />

          {/* Subsurface Radiance Bleed */}
          <g clipPath="url(#silo-icon-pinClip)">
            <circle cx="430" cy="620" r="180" fill="url(#silo-icon-leftGlow)" opacity="0.45" />
            <circle cx="680" cy="640" r="160" fill="url(#silo-icon-rightGlow)" opacity="0.45" />
          </g>
        </g>
      )}
    </svg>
  );
}
