"use client"

import { motion } from "motion/react"
import { LockIcon, Link2Icon, UploadCloudIcon, SparklesIcon, type LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: LockIcon,
    title: "Private by default",
    description: "Every file you upload is visible only to you until you decide otherwise. Zero tracking, zero silent opt-ins.",
  },
  {
    icon: Link2Icon,
    title: "Share with one link",
    description: "Flip a file to public and get an unguessable link instantly. Anyone with it can view it with zero friction.",
  },
  {
    icon: UploadCloudIcon,
    title: "Built for big files",
    description: "Uploads stream directly to cloud storage with live progress, built to scale effortlessly.",
  },
  {
    icon: SparklesIcon,
    title: "Ask Silvi",
    description: "Find, move, star, or share files by asking in plain language. Sensitive actions always pause for your confirmation first.",
  },
]

export function FeatureShowcase() {
  return (
    <section id="features" className="bg-muted py-24 px-6 text-foreground">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 max-w-2xl">
          <span className="text-[12px] font-medium tracking-[0.08em] text-laser-violet uppercase">
            Engineered for absolute control
          </span>
          <h2 className="mt-3 text-[32px] sm:text-[42px] leading-[1.12] font-medium tracking-[-0.04em] text-foreground">
            Designed for speed, built for privacy.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              className="group relative flex flex-col rounded-[18px] border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-cream-canvas text-laser-violet transition-transform duration-300 group-hover:scale-105">
                <feature.icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 text-[19px] font-semibold tracking-[-0.025em] text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
