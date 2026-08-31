"use client"

import { motion } from "motion/react"
import { PillButton } from "@/components/marketing/pill-button"
import { AnimatedCta } from "@/components/marketing/animated-cta"
import { DashboardPreview } from "@/components/marketing/dashboard-preview"

const partners = ["SUPABASE", "NEON", "VERCEL", "CLOUDFLARE", "LINEAR"]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(185,151,255,0.10),rgba(185,151,255,0.08),transparent)]"
        aria-hidden="true"
      />
      <div className="mesh-orb mesh-orb-1 pointer-events-none -z-10" aria-hidden="true" />
      <div className="mesh-orb mesh-orb-2 pointer-events-none -z-10" aria-hidden="true" />

      <div className="mx-auto max-w-[1440px] flex flex-col items-center">
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-lavender-mist bg-carbon-ink px-3.5 py-1 text-[11px] font-medium tracking-[0.08em] text-laser-violet uppercase"
        >
          <span className="size-1.5 rounded-full bg-laser-violet animate-pulse" />
          <span>Private by default</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className="mt-6 max-w-4xl text-[42px] leading-[1.08] font-semibold tracking-[-0.05em] text-ink-black sm:text-[60px] md:text-[68px]"
        >
          Keep what&apos;s yours, <br className="hidden sm:inline" />
          <span className="font-serif italic font-medium text-laser-violet">share what you choose.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.7, ease: "easeOut" }}
          className="mt-5 max-w-2xl text-[16px] leading-[1.5] text-silver-smoke sm:text-[18px] tracking-[-0.025em]"
        >
          Silo gives you full control over your private files — upload, organize into folders, and
          share exactly the way you choose: a public link, or a direct grant to one person, revocable
          anytime.
        </motion.p>

        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.34, duration: 0.7, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <AnimatedCta href="/signup">Get started for free</AnimatedCta>
          <PillButton href="/login" variant="outline">
            Sign in to vault
          </PillButton>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.46, duration: 0.8, ease: "easeOut" }}
          className="mt-16 w-full max-w-[1000px]"
        >
          <DashboardPreview />
        </motion.div>
      </div>

      <div className="mt-20 border-t border-lavender-mist/60 pt-10">
        <p className="text-[12px] font-medium tracking-[0.08em] text-ash-wisp uppercase">
          Proudly built on modern infrastructure
        </p>
        <div
          className="mt-7 w-full overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            className="flex w-max items-center gap-16 sm:gap-24"
          >
            {[...partners, ...partners].map((partner, i) => (
              <span
                key={`${partner}-${i}`}
                className="shrink-0 font-mono text-[14px] font-semibold tracking-[0.1em] text-silver-smoke/70"
              >
                {partner}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
