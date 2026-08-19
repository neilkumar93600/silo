"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import {
  LockIcon,
  RotateCcwIcon,
  FolderTreeIcon,
  SparklesIcon,
  UploadCloudIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

interface Benefit {
  title: string
  description: string
  icon: LucideIcon
}

const benefits: Benefit[] = [
  {
    title: "Private by default",
    description: "Nothing you upload is visible to anyone else until you explicitly choose to share it.",
    icon: LockIcon,
  },
  {
    title: "Revoke access anytime",
    description: "Change your mind about a share and it's gone instantly — no waiting, no support ticket.",
    icon: RotateCcwIcon,
  },
  {
    title: "Real folders",
    description: "Nest folders as deep as you need and move files between them without losing track.",
    icon: FolderTreeIcon,
  },
  {
    title: "An assistant that asks first",
    description: "Silvi can find, move, and share files for you in plain language, and always pauses for your confirmation before anything sensitive.",
    icon: SparklesIcon,
  },
  {
    title: "Built for big files",
    description: "Uploads stream directly to cloud storage with live progress, so large media doesn't choke your browser.",
    icon: UploadCloudIcon,
  },
  {
    title: "No bloat",
    description: "A fast, focused drive — no ads, no upsell nags, no feature you didn't ask for.",
    icon: ZapIcon,
  },
]

function BenefitRow({ benefit, delay }: { benefit: Benefit; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex gap-5"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
        <benefit.icon className="size-5 text-chart-2" strokeWidth={2.25} />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-foreground">{benefit.title}</h3>
        <p className="text-[14px] leading-[1.6] text-muted-foreground">{benefit.description}</p>
      </div>
    </motion.div>
  )
}

export function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] })
  const railProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <section className="bg-card py-24 px-6">
      <div ref={containerRef} className="mx-auto max-w-[1248px]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 justify-between">
          <div className="w-full lg:max-w-[420px] lg:sticky lg:top-24 self-start flex gap-5">
            <div className="hidden lg:block relative w-px shrink-0 bg-border">
              <motion.div
                style={{ scaleY: railProgress }}
                className="absolute inset-0 w-px origin-top bg-chart-2"
              />
            </div>
            <div>
              <span className="text-[12px] font-medium tracking-[0.08em] text-laser-violet uppercase">Why Silo</span>
              <h2 className="mt-3 text-[32px] sm:text-[42px] leading-[1.12] font-medium tracking-[-0.04em] text-foreground">
                Control, not compromise.
              </h2>
              <p className="mt-4 text-[15px] leading-[1.6] text-muted-foreground">
                Six things Silo actually does today — not a roadmap, not a promise.
              </p>
            </div>
          </div>

          <div className="w-full lg:max-w-[600px] grid gap-10 sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <BenefitRow key={benefit.title} benefit={benefit} delay={(i % 2) * 0.08} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
