"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { UploadCloudIcon, FolderIcon, ShieldCheckIcon, SparklesIcon, CheckIcon, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  label: string
  icon: LucideIcon
  heading: string
  description: string
  points: string[]
}

const steps: Step[] = [
  {
    id: 1,
    label: "Upload",
    icon: UploadCloudIcon,
    heading: "Upload your files",
    description: "Drag files in or drop them anywhere on the page. Uploads stream straight to cloud storage with live progress.",
    points: ["No file-count limits", "Live upload progress", "5 GB free to start"],
  },
  {
    id: 2,
    label: "Organize",
    icon: FolderIcon,
    heading: "Organize into folders",
    description: "Create folders, nest them, and move files between them — your drive stays exactly as tidy as you want it.",
    points: ["Nested folders", "Drag to move", "Rename anytime"],
  },
  {
    id: 3,
    label: "Share",
    icon: ShieldCheckIcon,
    heading: "Choose who sees it",
    description: "Keep a file private, flip it to a public link, or grant access to one person by email — revocable at any time.",
    points: ["Unguessable public links", "Per-person access", "Revoke in one click"],
  },
  {
    id: 4,
    label: "Ask Silvi",
    icon: SparklesIcon,
    heading: "Manage it in plain language",
    description: "Ask Silvi to find a file, check your storage breakdown, or share something — sensitive actions always ask you to confirm first.",
    points: ["Natural-language search", "Storage breakdown on demand", "Confirms before anything sensitive"],
  },
]

export function HowItWorks() {
  const [activeId, setActiveId] = useState(1)
  const active = steps.find((s) => s.id === activeId) ?? steps[0]!

  return (
    <section id="how-it-works" className="bg-void-plum py-24 px-6">
      <div className="mx-auto max-w-[1248px]">
        <div className="mb-12 max-w-xl">
          <span className="text-[12px] font-medium tracking-[0.08em] text-laser-violet uppercase">Process</span>
          <h2 className="mt-3 text-[32px] sm:text-[42px] leading-[1.12] font-medium tracking-[-0.04em] text-paper-white">
            From upload to shared, in four steps.
          </h2>
        </div>

        <div className="rounded-2xl border border-lavender-mist bg-eclipse-black p-2 flex flex-wrap gap-1">
          {steps.map((step) => {
            const isActive = step.id === activeId
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveId(step.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[14px] transition-colors",
                  isActive ? "bg-void-plum text-laser-violet font-medium" : "text-silver-smoke hover:text-paper-white"
                )}
              >
                <step.icon className="size-4" strokeWidth={2.25} />
                {step.label}
              </button>
            )
          })}
        </div>

        <div className="mt-6 rounded-[24px] border border-lavender-mist bg-eclipse-black p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full lg:max-w-xl"
            >
              <div className="flex size-14 items-center justify-center rounded-xl border border-lavender-mist bg-void-plum text-laser-violet">
                <active.icon className="size-6" strokeWidth={2} />
              </div>
              <h3 className="mt-5 text-[26px] font-semibold tracking-[-0.02em] text-paper-white">{active.heading}</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-silver-smoke">{active.description}</p>
              <div className="mt-6 flex flex-col gap-2.5">
                {active.points.map((point) => (
                  <div key={point} className="flex items-center gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-chart-2/15">
                      <CheckIcon className="size-3 text-chart-2" strokeWidth={3} />
                    </span>
                    <span className="text-[14px] font-medium text-paper-white">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative w-full lg:w-[340px] shrink-0 aspect-square max-h-[280px]">
            <div className="mesh-orb mesh-orb-3 pointer-events-none" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative flex size-full items-center justify-center rounded-[20px] border border-lavender-mist bg-void-plum/60"
              >
                <span className="absolute left-4 top-4 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-lavender-mist" />
                  <span className="size-1.5 rounded-full bg-lavender-mist" />
                  <span className="size-1.5 rounded-full bg-lavender-mist" />
                </span>
                <active.icon className="size-16 text-laser-violet" strokeWidth={1.25} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
