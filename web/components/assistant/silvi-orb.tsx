"use client"

import * as React from "react"
import { motion, type TargetAndTransition, type Transition } from "motion/react"
import { cn } from "@/lib/utils"
import type { SilviStatus } from "@/components/layout/assistant-context"

// Doppler brand color palette definitions for Silvi
// Lavender Spark: #b997ff, Neon Violet: #6b13f5, Ember Orange: #ff5632,
// Plasma Pink: #ff9efa, Signal Green: #00f575 (status/action accents only)

interface StateConfig {
  gradientPrimary: string
  gradientSecondary: string
  auraGlow: string
  specularTint: string
  spinSpeed: number
  counterSpinSpeed: number
  orbScale: number[]
  orbDuration: number
  eyeAnimate: TargetAndTransition
  eyeTransition: Transition
  label: string
}

const STATE_CONFIGS: Record<SilviStatus, StateConfig> = {
  idle: {
    gradientPrimary: "conic-gradient(from 0deg, #b997ff 0%, #6b13f5 25%, #b997ff 50%, #ff9efa 75%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 65% 65%, #b997ff 0%, transparent 60%)",
    auraGlow: "0 0 24px rgba(185, 151, 255, 0.35), 0 0 10px rgba(255, 158, 250, 0.25)",
    specularTint: "rgba(255, 255, 255, 0.9)",
    spinSpeed: 20,
    counterSpinSpeed: 14,
    orbScale: [1, 1.025, 1],
    orbDuration: 4,
    eyeAnimate: {
      y: [0, -0.5, 0, 0, 0],
      x: [0, 0.8, 0, -0.8, 0],
      scaleY: [1, 1, 1, 0.1, 1, 1, 0.1, 1],
    },
    eyeTransition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.53, 0.56, 0.85, 0.88, 1],
    },
    label: "Ready",
  },
  thinking: {
    gradientPrimary: "conic-gradient(from 45deg, #b997ff 0%, #6b13f5 30%, #ff9efa 55%, #6b13f5 80%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 35% 65%, #6b13f5 0%, #ff9efa 40%, transparent 70%)",
    auraGlow: "0 0 28px rgba(107, 19, 245, 0.5), 0 0 12px rgba(255, 158, 250, 0.4)",
    specularTint: "rgba(230, 245, 255, 0.95)",
    spinSpeed: 10,
    counterSpinSpeed: 7,
    orbScale: [1, 1.04, 1],
    orbDuration: 2.2,
    eyeAnimate: {
      x: [-2.2, 2.2, -2.2],
      y: [-1.8, 0, -1.8],
      scaleY: [1, 0.9, 1],
    },
    eyeTransition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
    label: "Thinking...",
  },
  typing: {
    gradientPrimary: "conic-gradient(from 120deg, #b997ff 0%, #b997ff 35%, #b997ff 60%, #ff9efa 80%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 50% 50%, #b997ff 0%, #b997ff 50%, transparent 75%)",
    auraGlow: "0 0 32px rgba(185, 151, 255, 0.6), 0 0 14px rgba(185, 151, 255, 0.45)",
    specularTint: "rgba(255, 255, 255, 1)",
    spinSpeed: 5,
    counterSpinSpeed: 3.5,
    orbScale: [1, 1.05, 1],
    orbDuration: 0.8,
    eyeAnimate: {
      y: [0, -2, 0],
      scale: [1, 1.1, 1],
      scaleY: [1, 1.15, 1],
    },
    eyeTransition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
    label: "Generating...",
  },
  checking: {
    gradientPrimary: "conic-gradient(from 180deg, #ff5632 0%, #ff5632 35%, #b997ff 65%, #ff5632 100%)",
    gradientSecondary: "radial-gradient(circle at 60% 40%, #ff5632 0%, #ff5632 50%, transparent 70%)",
    auraGlow: "0 0 30px rgba(255, 86, 50, 0.55), 0 0 12px rgba(255, 86, 50, 0.4)",
    specularTint: "rgba(255, 245, 235, 1)",
    spinSpeed: 14,
    counterSpinSpeed: 9,
    orbScale: [1, 1.08, 1],
    orbDuration: 1.4,
    eyeAnimate: {
      scale: [1, 1.25, 1],
      y: [0, -0.8, 0],
    },
    eyeTransition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
    label: "Waiting for confirmation",
  },
  processing: {
    gradientPrimary: "conic-gradient(from 270deg, #b997ff 0%, #6b13f5 30%, #6b13f5 55%, #ff9efa 80%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 50% 50%, #6b13f5 0%, #b997ff 40%, transparent 80%)",
    auraGlow: "0 0 34px rgba(107, 19, 245, 0.6), 0 0 16px rgba(255, 158, 250, 0.5)",
    spinSpeed: 2.2,
    counterSpinSpeed: 1.8,
    specularTint: "rgba(255, 255, 255, 1)",
    orbScale: [1, 1.06, 0.98, 1],
    orbDuration: 0.9,
    eyeAnimate: {
      x: [-2.5, 2.5, -2.5],
      y: [0, -0.8, 0, 0.8, 0],
      scaleX: [1, 1.15, 1],
    },
    eyeTransition: {
      duration: 0.7,
      repeat: Infinity,
      ease: "linear",
    },
    label: "Processing action...",
  },
}

export interface SilviOrbProps {
  status?: SilviStatus
  size?: number
  showGlow?: boolean
  showRings?: boolean
  className?: string
  interactive?: boolean
}

export function SilviOrb({
  status = "idle",
  size = 32,
  showGlow = true,
  showRings = false,
  className,
  interactive = true,
}: SilviOrbProps) {
  const config = STATE_CONFIGS[status] ?? STATE_CONFIGS.idle
  const eyeSize = Math.max(3, Math.round(size * 0.13))
  const eyeGap = Math.max(3, Math.round(size * 0.16))
  const eyeRadius = Math.max(1.5, Math.round(eyeSize * 0.5))

  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className={cn("relative shrink-0 select-none flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* Dynamic Ambient Aura Glow */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700"
          style={{
            boxShadow: config.auraGlow,
            opacity: status === "idle" ? (isHovered ? 0.9 : 0.6) : 0.95,
          }}
          animate={{
            scale: config.orbScale,
          }}
          transition={{
            duration: config.orbDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Optional Outer Orbital Ring for Processing / Thinking */}
      {(showRings || status === "processing" || status === "thinking") && (
        <motion.div
          className="absolute -inset-1.5 rounded-full border border-plasma-pink/30 pointer-events-none"
          style={{
            borderTopColor: status === "checking" ? "#ff5632" : "#b997ff",
            borderRightColor: "transparent",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: status === "processing" ? 1.5 : 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Main 3D Spherical Ball */}
      <motion.div
        className="relative size-full rounded-full overflow-hidden"
        style={{
          boxShadow: `
            0 ${Math.max(2, size * 0.08)}px ${Math.max(6, size * 0.25)}px rgba(185, 151, 255, 0.35),
            inset 0 0 0 1px rgba(255, 255, 255, 0.22),
            inset 0 -${Math.max(2, size * 0.12)}px ${Math.max(4, size * 0.2)}px rgba(1, 24, 33, 0.65),
            inset 0 ${Math.max(1, size * 0.06)}px ${Math.max(2, size * 0.12)}px rgba(255, 255, 255, 0.6)
          `,
        }}
        animate={{
          scale: isHovered ? 1.08 : config.orbScale,
        }}
        transition={{
          duration: isHovered ? 0.25 : config.orbDuration,
          repeat: isHovered ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Layer 1: Core Swirling Conic Gradient */}
        <motion.div
          className="absolute -inset-[50%]"
          style={{ background: config.gradientPrimary }}
          animate={{ rotate: 360 }}
          transition={{
            duration: config.spinSpeed,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Layer 2: Counter-Harmonic Secondary Wave */}
        <motion.div
          className="absolute -inset-[35%] mix-blend-screen opacity-75"
          style={{ background: config.gradientSecondary }}
          animate={{ rotate: -360 }}
          transition={{
            duration: config.counterSpinSpeed,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Layer 3: 3D Volumetric Depth & Ambient Occlusion */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: `
              radial-gradient(circle at 75% 80%, rgba(1, 24, 33, 0.85) 0%, transparent 60%),
              radial-gradient(circle at 20% 20%, transparent 40%, rgba(185, 151, 255, 0.5) 100%)
            `,
          }}
        />

        {/* Layer 4: Top-Left 3D Gloss Specular Highlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 26%, ${config.specularTint} 0%, rgba(255, 255, 255, 0.35) 24%, transparent 58%)`,
          }}
        />

        {/* Layer 5: Bottom Rim Light Accent */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${
              status === "checking" ? "rgba(255, 86, 50, 0.6)" : "rgba(255, 158, 250, 0.45)"
            } 0%, transparent 45%)`,
          }}
        />

        {/* Layer 6: Expressive Luminous Eyes */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ gap: eyeGap }}
        >
          {[0, 1].map((index) => (
            <motion.div
              key={index}
              className="relative rounded-full bg-white flex items-center justify-center"
              style={{
                width: eyeSize,
                height: eyeSize * 1.15,
                borderRadius: `${eyeRadius}px`,
                boxShadow: `
                  0 0 ${Math.max(2, size * 0.08)}px rgba(255, 255, 255, 0.95),
                  0 1px 2px rgba(185, 151, 255, 0.4)
                `,
              }}
              animate={
                isHovered
                  ? {
                      scale: 1.2,
                      y: -1,
                      x: index === 0 ? -0.5 : 0.5,
                    }
                  : config.eyeAnimate
              }
              transition={
                isHovered
                  ? { duration: 0.2 }
                  : config.eyeTransition
              }
            >
              {/* Inner pupil / micro highlight for large sizes */}
              {size >= 36 && (
                <span
                  className="block rounded-full bg-[#b997ff]/80"
                  style={{
                    width: Math.max(1.5, eyeSize * 0.35),
                    height: Math.max(1.5, eyeSize * 0.35),
                    marginTop: size >= 48 ? 1 : 0,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
