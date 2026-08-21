"use client"

import * as React from "react"
import { motion, type TargetAndTransition, type Transition } from "motion/react"
import { cn } from "@/lib/utils"
import type { SilviStatus } from "@/components/layout/assistant-context"

export type ExtendedSilviStatus = SilviStatus | "success"

interface ShapeMorphConfig {
  gradientPrimary: string
  gradientSecondary: string
  auraGlow: string
  specularTint: string
  spinSpeed: number
  counterSpinSpeed: number
  // Real organic fluid shape morphing via border-radius
  morphBorderRadius: string[]
  morphScale: number[]
  morphRotate: number[]
  morphDuration: number
  ringCount: number
  ringSpeed: number
  ringColor: string
  ringTilt: string
  eyeType: "default" | "thinking" | "typing" | "checking" | "processing" | "success"
  label: string
}

const STATE_CONFIGS: Record<ExtendedSilviStatus, ShapeMorphConfig> = {
  idle: {
    gradientPrimary: "conic-gradient(from 0deg, #b997ff 0%, #6b13f5 28%, #b997ff 50%, #ff9efa 78%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 65% 65%, #b997ff 0%, #6b13f5 40%, transparent 70%)",
    auraGlow: "0 0 28px rgba(185, 151, 255, 0.45), 0 0 12px rgba(255, 158, 250, 0.3)",
    specularTint: "rgba(255, 255, 255, 0.95)",
    spinSpeed: 16,
    counterSpinSpeed: 12,
    // Organic floating droplet morph
    morphBorderRadius: [
      "50% 50% 50% 50%",
      "46% 54% 52% 48% / 54% 48% 52% 46%",
      "52% 48% 46% 54% / 48% 54% 46% 52%",
      "48% 52% 54% 46% / 52% 46% 54% 48%",
      "50% 50% 50% 50%",
    ],
    morphScale: [1, 1.03, 0.98, 1.02, 1],
    morphRotate: [0, 2, -2, 1, 0],
    morphDuration: 5,
    ringCount: 1,
    ringSpeed: 8,
    ringColor: "#b997ff",
    ringTilt: "rotateX(60deg) rotateY(15deg)",
    eyeType: "default",
    label: "Ready",
  },
  thinking: {
    gradientPrimary: "conic-gradient(from 45deg, #b997ff 0%, #6b13f5 30%, #ff9efa 60%, #6b13f5 85%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 35% 65%, #6b13f5 0%, #ff9efa 45%, transparent 75%)",
    auraGlow: "0 0 36px rgba(107, 19, 245, 0.7), 0 0 18px rgba(255, 158, 250, 0.5)",
    specularTint: "rgba(230, 245, 255, 0.95)",
    spinSpeed: 5,
    counterSpinSpeed: 3.5,
    // Diamond Prism / Gyroscope geometry morph
    morphBorderRadius: [
      "50% 50% 50% 50%",
      "32% 68% 30% 70% / 70% 30% 70% 30%",
      "68% 32% 70% 30% / 30% 70% 30% 70%",
      "35% 65% 35% 65% / 65% 35% 65% 35%",
      "50% 50% 50% 50%",
    ],
    morphScale: [1, 1.08, 0.94, 1.06, 1],
    morphRotate: [0, 45, 90, 135, 180],
    morphDuration: 2.2,
    ringCount: 2,
    ringSpeed: 3,
    ringColor: "#ff9efa",
    ringTilt: "rotateX(70deg) rotateY(45deg)",
    eyeType: "thinking",
    label: "Analyzing vault...",
  },
  typing: {
    gradientPrimary: "conic-gradient(from 120deg, #b997ff 0%, #ff9efa 35%, #00f575 60%, #b997ff 85%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 50% 50%, #b997ff 0%, #ff9efa 50%, transparent 75%)",
    auraGlow: "0 0 40px rgba(185, 151, 255, 0.75), 0 0 20px rgba(255, 158, 250, 0.6)",
    specularTint: "rgba(255, 255, 255, 1)",
    spinSpeed: 3,
    counterSpinSpeed: 2,
    // High-frequency elastic bouncy blob morph
    morphBorderRadius: [
      "50% 50% 50% 50%",
      "38% 62% 63% 37% / 41% 44% 56% 59%",
      "60% 40% 30% 70% / 60% 30% 70% 40%",
      "40% 60% 65% 35% / 35% 65% 35% 65%",
      "50% 50% 50% 50%",
    ],
    morphScale: [1, 1.15, 0.9, 1.12, 1],
    morphRotate: [-4, 6, -6, 4, -4],
    morphDuration: 0.85,
    ringCount: 2,
    ringSpeed: 1.8,
    ringColor: "#00f575",
    ringTilt: "rotateX(50deg) rotateY(25deg)",
    eyeType: "typing",
    label: "Generating output...",
  },
  checking: {
    gradientPrimary: "conic-gradient(from 180deg, #ff5632 0%, #ff5632 40%, #b997ff 70%, #ff5632 100%)",
    gradientSecondary: "radial-gradient(circle at 60% 40%, #ff5632 0%, #ff5632 50%, transparent 75%)",
    auraGlow: "0 0 38px rgba(255, 86, 50, 0.75), 0 0 18px rgba(255, 86, 50, 0.5)",
    specularTint: "rgba(255, 245, 235, 1)",
    spinSpeed: 8,
    counterSpinSpeed: 6,
    // Hexagonal Guard Shield geometry morph
    morphBorderRadius: [
      "50% 50% 50% 50%",
      "22% 22% 55% 55% / 22% 22% 68% 68%",
      "18% 18% 58% 58% / 18% 18% 72% 72%",
      "25% 25% 52% 52% / 25% 25% 65% 65%",
      "50% 50% 50% 50%",
    ],
    morphScale: [1, 1.12, 1.02, 1.1, 1],
    morphRotate: [0, -3, 3, -2, 0],
    morphDuration: 1.2,
    ringCount: 1,
    ringSpeed: 2,
    ringColor: "#ff5632",
    ringTilt: "rotateX(80deg)",
    eyeType: "checking",
    label: "Security inspection",
  },
  processing: {
    gradientPrimary: "conic-gradient(from 270deg, #b997ff 0%, #6b13f5 25%, #00f575 55%, #ff9efa 80%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 50% 50%, #6b13f5 0%, #00f575 40%, transparent 80%)",
    auraGlow: "0 0 44px rgba(107, 19, 245, 0.8), 0 0 22px rgba(0, 245, 117, 0.6)",
    specularTint: "rgba(255, 255, 255, 1)",
    spinSpeed: 1.5,
    counterSpinSpeed: 1.2,
    // Quantum Singularity Vortex morph
    morphBorderRadius: [
      "50% 50% 50% 50%",
      "35% 65% 60% 40% / 45% 35% 65% 55%",
      "65% 35% 40% 60% / 35% 65% 45% 55%",
      "40% 60% 35% 65% / 60% 40% 55% 45%",
      "50% 50% 50% 50%",
    ],
    morphScale: [0.95, 1.18, 0.92, 1.15, 0.95],
    morphRotate: [0, 90, 180, 270, 360],
    morphDuration: 0.65,
    ringCount: 3,
    ringSpeed: 1.0,
    ringColor: "#00f575",
    ringTilt: "rotateX(65deg) rotateY(45deg)",
    eyeType: "processing",
    label: "Executing quantum stream...",
  },
  success: {
    gradientPrimary: "conic-gradient(from 0deg, #00f575 0%, #059669 35%, #00f575 70%, #b997ff 100%)",
    gradientSecondary: "radial-gradient(circle at 50% 50%, #00f575 0%, #10b981 50%, transparent 80%)",
    auraGlow: "0 0 42px rgba(0, 245, 117, 0.8), 0 0 20px rgba(0, 245, 117, 0.5)",
    specularTint: "rgba(255, 255, 255, 1)",
    spinSpeed: 6,
    counterSpinSpeed: 4.5,
    // Radiant Starburst Crown morph
    morphBorderRadius: [
      "50% 50% 50% 50%",
      "45% 55% 45% 55% / 55% 45% 55% 45%",
      "55% 45% 55% 45% / 45% 55% 45% 55%",
      "50% 50% 50% 50%",
    ],
    morphScale: [1, 1.25, 0.95, 1.1, 1],
    morphRotate: [0, -10, 10, -5, 0],
    morphDuration: 1.0,
    ringCount: 2,
    ringSpeed: 2.5,
    ringColor: "#00f575",
    ringTilt: "rotateX(40deg) rotateY(20deg)",
    eyeType: "success",
    label: "Done!",
  },
}

export interface SilviOrbProps {
  status?: ExtendedSilviStatus
  size?: number
  showGlow?: boolean
  showRings?: boolean
  className?: string
  interactive?: boolean
}

export function SilviOrb({
  status = "idle",
  size = 36,
  showGlow = true,
  showRings = false,
  className,
  interactive = true,
}: SilviOrbProps) {
  const config = STATE_CONFIGS[status] ?? STATE_CONFIGS.idle
  const [isHovered, setIsHovered] = React.useState(false)

  const eyeSize = Math.max(3, Math.round(size * 0.14))
  const eyeGap = Math.max(3, Math.round(size * 0.18))

  return (
    <div
      className={cn("relative shrink-0 select-none flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      {/* 1. Dynamic Ambient Aura Glow */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 pointer-events-none transition-all duration-500"
          style={{
            boxShadow: config.auraGlow,
            opacity: status === "idle" ? (isHovered ? 0.95 : 0.65) : 0.95,
          }}
          animate={{
            borderRadius: config.morphBorderRadius,
            scale: config.morphScale,
            rotate: config.morphRotate,
          }}
          transition={{
            duration: config.morphDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* 2. Atomic Gyroscope Orbital Ring 1 */}
      {(showRings || config.ringCount >= 1) && (
        <div
          className="absolute -inset-2.5 pointer-events-none flex items-center justify-center"
          style={{ transform: config.ringTilt, perspective: 500 }}
        >
          <motion.div
            className="size-full rounded-full border border-dashed"
            style={{
              borderColor: `${config.ringColor}60`,
              borderTopColor: config.ringColor,
              borderWidth: size > 40 ? 1.5 : 1,
            }}
            animate={{ rotateZ: 360 }}
            transition={{
              duration: config.ringSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      )}

      {/* 3. Atomic Gyroscope Orbital Ring 2 (Counter-Angled) */}
      {(showRings || config.ringCount >= 2) && (
        <div
          className="absolute -inset-3 pointer-events-none flex items-center justify-center"
          style={{ transform: "rotateX(75deg) rotateY(-40deg)", perspective: 500 }}
        >
          <motion.div
            className="size-full rounded-full border"
            style={{
              borderColor: "transparent",
              borderTopColor: config.ringColor,
              borderBottomColor: "#b997ff80",
              borderWidth: size > 40 ? 1.5 : 1,
            }}
            animate={{ rotateZ: -360 }}
            transition={{
              duration: config.ringSpeed * 1.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      )}

      {/* 4. Main Morphing Organic Physical Core */}
      <motion.div
        className="relative size-full overflow-hidden"
        style={{
          boxShadow: `
            0 ${Math.max(2, size * 0.08)}px ${Math.max(6, size * 0.25)}px rgba(0, 0, 0, 0.5),
            inset 0 0 0 1px rgba(255, 255, 255, 0.3),
            inset 0 -${Math.max(2, size * 0.12)}px ${Math.max(4, size * 0.2)}px rgba(1, 24, 33, 0.7),
            inset 0 ${Math.max(1, size * 0.06)}px ${Math.max(2, size * 0.12)}px rgba(255, 255, 255, 0.7)
          `,
        }}
        animate={{
          borderRadius: isHovered
            ? ["50%", "45% 55% 55% 45% / 55% 45% 45% 55%", "50%"]
            : config.morphBorderRadius,
          scale: isHovered ? 1.12 : config.morphScale,
          rotate: isHovered ? [0, 5, -5, 0] : config.morphRotate,
        }}
        transition={{
          duration: isHovered ? 0.4 : config.morphDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Layer A: Swirling Conic Plasma Field */}
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

        {/* Layer B: Counter-Harmonic Secondary Wave */}
        <motion.div
          className="absolute -inset-[40%] mix-blend-screen opacity-80"
          style={{ background: config.gradientSecondary }}
          animate={{ rotate: -360 }}
          transition={{
            duration: config.counterSpinSpeed,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Layer C: 3D Volumetric Depth Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 75% 80%, rgba(10, 5, 20, 0.85) 0%, transparent 60%),
              radial-gradient(circle at 20% 20%, transparent 40%, rgba(255, 255, 255, 0.25) 100%)
            `,
          }}
        />

        {/* Layer D: 3D Top-Left Specular Gloss */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${config.specularTint} 0%, rgba(255, 255, 255, 0.35) 28%, transparent 60%)`,
          }}
        />

        {/* Layer E: Expressive Physical Facial Geometry */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ gap: eyeGap }}
        >
          {/* Eye Left & Right rendered based on expressive eyeType */}
          {config.eyeType === "default" && (
            <>
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                  style={{ width: eyeSize, height: eyeSize * 1.25 }}
                  animate={{
                    scaleY: [1, 1, 0.1, 1, 1, 0.1, 1],
                    y: [0, -1, 0, 1, 0],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    times: [0, 0.45, 0.48, 0.52, 0.85, 0.88, 1],
                  }}
                />
              ))}
            </>
          )}

          {config.eyeType === "thinking" && (
            // Laser Scanning Slits tracking horizontally
            <motion.div
              className="flex items-center justify-center gap-1.5"
              animate={{ x: [-size * 0.15, size * 0.15, -size * 0.15] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="rounded-full bg-cyan-200 shadow-[0_0_10px_#67e8f9]"
                style={{ width: eyeSize * 0.9, height: eyeSize * 1.5 }}
              />
              <div
                className="rounded-full bg-cyan-200 shadow-[0_0_10px_#67e8f9]"
                style={{ width: eyeSize * 0.9, height: eyeSize * 1.5 }}
              />
            </motion.div>
          )}

          {config.eyeType === "typing" && (
            // Excited Wide Bouncing Eyes
            <>
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full bg-white shadow-[0_0_10px_#00f575]"
                  style={{ width: eyeSize * 1.2, height: eyeSize * 1.2 }}
                  animate={{
                    scale: [1, 1.3, 0.9, 1.2, 1],
                    y: [0, -2.5, 0, -1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="block size-1 rounded-full bg-[#00f575] mt-0.5 mx-auto" />
                </motion.div>
              ))}
            </>
          )}

          {config.eyeType === "checking" && (
            // Alert Shield Focused Eyes
            <>
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-md bg-white shadow-[0_0_10px_#ff5632]"
                  style={{ width: eyeSize * 1.1, height: eyeSize * 1.1 }}
                  animate={{
                    scale: [1, 1.25, 1],
                    rotate: i === 0 ? [0, -10, 0] : [0, 10, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </>
          )}

          {config.eyeType === "processing" && (
            // High-Speed Aperture Eye
            <motion.div
              className="rounded-full border-2 border-white bg-[#00f575] shadow-[0_0_12px_#00f575] flex items-center justify-center"
              style={{ width: eyeSize * 2.2, height: eyeSize * 2.2 }}
              animate={{ rotate: 360, scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            >
              <div className="size-1 rounded-full bg-white" />
            </motion.div>
          )}

          {config.eyeType === "success" && (
            // Happy Curved Arch Eyes (^ ^)
            <div className="flex items-center gap-1.5 pt-0.5">
              <motion.div
                className="border-t-2 border-white rounded-t-full"
                style={{ width: eyeSize * 1.4, height: eyeSize * 0.8 }}
                animate={{ scaleY: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.div
                className="border-t-2 border-white rounded-t-full"
                style={{ width: eyeSize * 1.4, height: eyeSize * 0.8 }}
                animate={{ scaleY: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

