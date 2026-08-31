import * as React from "react";
import { cn } from "@/lib/utils";
import type { SilviIconProps } from "../types";

/**
 * Silvi AI Mascot Avatar Component
 * 9 Expressive Facial Modes:
 * - "idle": Calm, friendly ready state
 * - "thinking": Cyan visor scanning pulses
 * - "typing": Active generating dots
 * - "checking": Security scanning visor
 * - "processing": High-speed quantum aperture
 * - "success": Cheerful smiling emerald expression
 * - "alert": Warning confirmation needed
 * - "happy": Joyful smile
 * - "sleepy": Low-power standby
 */
export function SilviAvatar({
  size = 48,
  mood = "idle",
  glow = true,
  className,
  ...props
}: SilviIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-label={`Silvi AI Assistant (${mood})`}
      role="img"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <defs>
        {/* Orb Body Gradient */}
        <radialGradient id="silvi-body" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#e8ecf1" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#cbd5e1" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.6" />
        </radialGradient>

        {/* Ambient Mood Glow */}
        <radialGradient id="silvi-ambient-glow" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor={
              mood === "alert"
                ? "#fa5d00"
                : mood === "success" || mood === "happy"
                ? "#10b981"
                : mood === "thinking" || mood === "processing"
                ? "#06b6d4"
                : "#c026d3"
            }
            stopOpacity={glow ? 0.35 : 0}
          />
          <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
        </radialGradient>

        {/* Visor / Face Glass Gradient */}
        <linearGradient id="silvi-visor-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#0f0f11" />
        </linearGradient>

        {/* Eye Glow Filter */}
        <filter id="silvi-eye-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient Glow Aura */}
      <circle cx="50" cy="50" r="48" fill="url(#silvi-ambient-glow)" />

      {/* Outer Head Body */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="url(#silvi-body)"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeOpacity="0.8"
      />

      {/* Cyber Ears / Antennas */}
      <path
        d="M 12 44 C 12 38 18 36 22 42 L 24 48"
        stroke="#c026d3"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 88 44 C 88 38 82 36 78 42 L 76 48"
        stroke="#06b6d4"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Dark Visor Screen */}
      <rect
        x="24"
        y="34"
        width="52"
        height="32"
        rx="16"
        fill="url(#silvi-visor-bg)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />

      {/* Visor Glare Accent */}
      <path
        d="M 28 38 C 36 36 64 36 72 38"
        stroke="#ffffff"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />

      {/* ── Expressive Eyes Geometry ── */}
      {mood === "idle" && (
        <g id="eyes-idle" filter="url(#silvi-eye-glow)">
          <circle cx="39" cy="50" r="4" fill="#00f575" />
          <circle cx="61" cy="50" r="4" fill="#00f575" />
          <circle cx="40.5" cy="48.5" r="1.2" fill="#ffffff" />
          <circle cx="62.5" cy="48.5" r="1.2" fill="#ffffff" />
        </g>
      )}

      {mood === "happy" && (
        <g id="eyes-happy" filter="url(#silvi-eye-glow)">
          <path d="M 34 52 C 34 46 44 46 44 52" stroke="#00f575" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 56 52 C 56 46 66 46 66 52" stroke="#00f575" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {mood === "thinking" && (
        <g id="eyes-thinking" filter="url(#silvi-eye-glow)">
          <rect x="33" y="48" width="12" height="3" rx="1.5" fill="#06b6d4" />
          <rect x="55" y="48" width="12" height="3" rx="1.5" fill="#06b6d4" />
        </g>
      )}

      {mood === "typing" && (
        <g id="eyes-typing" filter="url(#silvi-eye-glow)">
          <circle cx="36" cy="50" r="2" fill="#c026d3" />
          <circle cx="43" cy="50" r="2" fill="#00f575" />
          <circle cx="57" cy="50" r="2" fill="#00f575" />
          <circle cx="64" cy="50" r="2" fill="#c026d3" />
        </g>
      )}

      {mood === "checking" && (
        <g id="eyes-checking" filter="url(#silvi-eye-glow)">
          <circle cx="39" cy="50" r="4.5" fill="none" stroke="#fa5d00" strokeWidth="2" />
          <circle cx="61" cy="50" r="4.5" fill="none" stroke="#fa5d00" strokeWidth="2" />
          <circle cx="39" cy="50" r="1.5" fill="#fa5d00" />
          <circle cx="61" cy="50" r="1.5" fill="#fa5d00" />
        </g>
      )}

      {mood === "processing" && (
        <g id="eyes-processing" filter="url(#silvi-eye-glow)">
          <circle cx="50" cy="50" r="7" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="50" cy="50" r="2.5" fill="#00f575" />
        </g>
      )}

      {mood === "success" && (
        <g id="eyes-success" filter="url(#silvi-eye-glow)">
          <path d="M 33 50 L 38 54 L 46 46" stroke="#00f575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 54 50 L 59 54 L 67 46" stroke="#00f575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      )}

      {mood === "alert" && (
        <g id="eyes-alert" filter="url(#silvi-eye-glow)">
          <circle cx="39" cy="50" r="4" fill="#fa5d00" />
          <circle cx="61" cy="50" r="4" fill="#fa5d00" />
          <rect x="49" y="44" width="2" height="8" rx="1" fill="#fa5d00" />
          <circle cx="50" cy="55" r="1" fill="#fa5d00" />
        </g>
      )}

      {mood === "sleepy" && (
        <g id="eyes-sleepy" filter="url(#silvi-eye-glow)">
          <path d="M 34 49 C 38 53 42 53 44 49" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 56 49 C 60 53 64 53 66 49" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}
    </svg>
  );
}
