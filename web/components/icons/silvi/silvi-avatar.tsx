import * as React from "react";
import { cn } from "@/lib/utils";
import type { SilviIconProps, SilviMood } from "../types";

export interface SilviAvatarProps extends SilviIconProps {
  mood?: SilviMood;
  glow?: boolean;
}

/**
 * Silvi AI Mascot Avatar with expressive facial geometry and Doppler aura
 */
export function SilviAvatar({
  size = 40,
  mood = "idle",
  glow = true,
  className,
  ...props
}: SilviAvatarProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn("relative shrink-0 select-none flex items-center justify-center", className)}
    >
      {glow && (
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-[10px] opacity-70 transition-all duration-300 pointer-events-none",
            mood === "success" && "bg-[#00f575]/40",
            mood === "thinking" && "bg-[#b997ff]/50",
            mood === "typing" && "bg-[#ff9efa]/45",
            mood === "checking" || mood === "alert" ? "bg-[#ff5632]/50" : "bg-[#b997ff]/35"
          )}
        />
      )}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        fill="none"
        aria-label={`Silvi Avatar (${mood})`}
        role="img"
        className="size-full"
        {...props}
      >
        <defs>
          {/* Silvi Body Spherical Gradient */}
          <radialGradient id="silvi-body-grad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#ff9efa" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#b997ff" />
            <stop offset="85%" stopColor="#6b13f5" />
            <stop offset="100%" stopColor="#250558" />
          </radialGradient>

          {/* Success Mode Green Orb */}
          <radialGradient id="silvi-success-grad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#6ee7b7" />
            <stop offset="65%" stopColor="#00f575" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>

          {/* Alert Mode Orange Orb */}
          <radialGradient id="silvi-alert-grad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#fda4af" />
            <stop offset="65%" stopColor="#ff5632" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>

          {/* Specular Highlight */}
          <radialGradient id="silvi-specular" cx="40%" cy="25%" r="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Eye Glow */}
          <filter id="eye-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Outer Halo */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke={mood === "success" ? "#00f575" : mood === "alert" || mood === "checking" ? "#ff5632" : "#b997ff"}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.45"
        />

        {/* Orbit Ring */}
        <ellipse
          cx="60"
          cy="60"
          rx="56"
          ry="20"
          stroke={mood === "success" ? "#00f575" : "#b997ff"}
          strokeWidth="1"
          opacity="0.3"
          transform="rotate(-25 60 60)"
        />

        {/* Main Physical Orb Core */}
        <circle
          cx="60"
          cy="60"
          r="46"
          fill={
            mood === "success"
              ? "url(#silvi-success-grad)"
              : mood === "alert" || mood === "checking"
              ? "url(#silvi-alert-grad)"
              : "url(#silvi-body-grad)"
          }
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
        />

        {/* Top-Left Specular Shine */}
        <ellipse cx="48" cy="38" rx="22" ry="14" fill="url(#silvi-specular)" transform="rotate(-15 48 38)" />

        {/* Expressive Facial Geometry */}
        <g id="silvi-face" filter="url(#eye-glow)">
          {mood === "idle" && (
            <>
              {/* Calm Open Eyes */}
              <circle cx="48" cy="60" r="5" fill="#ffffff" />
              <circle cx="72" cy="60" r="5" fill="#ffffff" />
              <circle cx="49.5" cy="58.5" r="1.8" fill="#1c1624" />
              <circle cx="73.5" cy="58.5" r="1.8" fill="#1c1624" />
              {/* Cute Smile */}
              <path d="M 55 69 Q 60 74 65 69" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
            </>
          )}

          {mood === "happy" && (
            <>
              {/* Happy Arched Eyes ( ^ ^ ) */}
              <path d="M 43 62 Q 48 54 53 62" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 67 62 Q 72 54 77 62" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Cheerful Smile */}
              <path d="M 53 69 Q 60 77 67 69" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {mood === "thinking" && (
            <>
              {/* Cyber Scanning Visor Slits */}
              <rect x="42" y="58" width="12" height="4" rx="2" fill="#67e8f9" />
              <rect x="66" y="58" width="12" height="4" rx="2" fill="#67e8f9" />
              <circle cx="56" cy="60" r="1.5" fill="#67e8f9" opacity="0.6" />
              <circle cx="64" cy="60" r="1.5" fill="#67e8f9" opacity="0.6" />
            </>
          )}

          {mood === "typing" && (
            <>
              {/* Excited Wide Eyes */}
              <circle cx="47" cy="58" r="6.5" fill="#ffffff" />
              <circle cx="73" cy="58" r="6.5" fill="#ffffff" />
              <circle cx="47" cy="58" r="3" fill="#00f575" />
              <circle cx="73" cy="58" r="3" fill="#00f575" />
              <path d="M 54 70 Q 60 76 66 70" stroke="#00f575" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          )}

          {mood === "success" && (
            <>
              {/* Radiant Star Eyes or Winks */}
              <path d="M 43 60 Q 48 52 53 60" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 67 60 Q 72 52 77 60" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <circle cx="60" cy="72" r="3.5" fill="#ffffff" />
            </>
          )}

          {(mood === "alert" || mood === "checking") && (
            <>
              {/* Focused Guard Eyes */}
              <polygon points="44,56 52,56 48,64" fill="#ffffff" />
              <polygon points="68,56 76,56 72,64" fill="#ffffff" />
              <line x1="53" y1="71" x2="67" y2="71" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {mood === "processing" && (
            <>
              {/* Quantum Aperture Eye */}
              <circle cx="60" cy="60" r="8" fill="none" stroke="#00f575" strokeWidth="2.5" strokeDasharray="3 3" />
              <circle cx="60" cy="60" r="3" fill="#ffffff" />
            </>
          )}

          {mood === "sleepy" && (
            <>
              {/* Sleeping Flat Line Eyes (- -) */}
              <line x1="43" y1="60" x2="53" y2="60" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="67" y1="60" x2="77" y2="60" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <text x="82" y="44" fill="#b997ff" fontSize="12" fontWeight="bold">z</text>
              <text x="90" y="34" fill="#ff9efa" fontSize="9" fontWeight="bold">z</text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
