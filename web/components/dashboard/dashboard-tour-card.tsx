"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  X,
  Sparkles,
  Upload,
  Search,
  Users,
  MessageCircle,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSidebarLayout } from "@/components/layout/sidebar-context"

const STORAGE_KEY = "silo-dashboard-tour-dismissed"

type Step = { icon: LucideIcon; title: string; description: string; target: string | null }

const STEPS: Step[] = [
  {
    icon: Sparkles,
    title: "Welcome to Silo",
    description: "A quick guide to everything you can do here.",
    target: null,
  },
  {
    icon: Upload,
    title: "Upload & organize",
    description: "Drag & drop files anywhere, or hit New for a file, folder, or folder upload.",
    target: "[data-tour='tour-new']",
  },
  {
    icon: Search,
    title: "Find anything fast",
    description: "Search the top bar, or press ⌘K / Ctrl+K to open the command palette.",
    target: "[data-tour='tour-search']",
  },
  {
    icon: Users,
    title: "Stay on top of it",
    description: "Shared with me, Recent, and Starred keep the files you care about one click away — including anything you've shared or that's been shared with you.",
    target: "[data-tour='tour-activity']",
  },
  {
    icon: MessageCircle,
    title: "Ask Silvi",
    description: "Your assistant finds, moves, and shares files in plain language — it always confirms before anything sensitive happens.",
    target: "[data-tour='tour-assistant']",
  },
  {
    icon: Trash2,
    title: "Trash & Settings",
    description: "Deleted files wait in Trash until you restore or purge them. Manage your account anytime in Settings.",
    target: "[data-tour='tour-system']",
  },
]

const SIDEBAR_TARGETS = new Set(["[data-tour='tour-new']", "[data-tour='tour-activity']", "[data-tour='tour-system']"])
const SPOTLIGHT_PAD = 8
const CARD_WIDTH = 320
const CARD_MARGIN = 16

type Rect = { top: number; left: number; width: number; height: number }

function measure(selector: string | null): Rect | null {
  if (!selector) return null
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return {
    top: r.top - SPOTLIGHT_PAD,
    left: r.left - SPOTLIGHT_PAD,
    width: r.width + SPOTLIGHT_PAD * 2,
    height: r.height + SPOTLIGHT_PAD * 2,
  }
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA"
}

function cardStyle(rect: Rect | null): React.CSSProperties {
  if (!rect) {
    return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
  }
  const vw = window.innerWidth
  const vh = window.innerHeight
  const spaceBelow = vh - (rect.top + rect.height)
  const placeBelow = spaceBelow > rect.top || spaceBelow > 240

  const left = Math.min(Math.max(rect.left, CARD_MARGIN), vw - CARD_WIDTH - CARD_MARGIN)

  return placeBelow
    ? { top: rect.top + rect.height + CARD_MARGIN, left }
    : { bottom: vh - rect.top + CARD_MARGIN, left }
}

export function DashboardTourCard() {
  // Starts false on both server and first client render (so hydration matches),
  // then flips on one frame after mount once localStorage is safe to read.
  const [active, setActive] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [rect, setRect] = React.useState<Rect | null>(null)
  const { isMobile, setMobileOpen } = useSidebarLayout()

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setActive(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const end = React.useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1")
    setActive(false)
    setMobileOpen(false)
  }, [setMobileOpen])

  // Position the spotlight on the current step's target, opening the mobile
  // sidebar drawer first when the target lives behind it.
  React.useEffect(() => {
    if (!active) return

    let cancelled = false
    let timer: number | undefined
    const target = current.target

    const raf = requestAnimationFrame(() => {
      if (cancelled) return
      const needsDrawer = isMobile && target !== null && SIDEBAR_TARGETS.has(target)
      if (isMobile) setMobileOpen(needsDrawer)
      timer = window.setTimeout(
        () => {
          if (!cancelled) setRect(measure(target))
        },
        needsDrawer ? 220 : 0,
      )
    })

    function reflow() {
      setRect(measure(target))
    }
    window.addEventListener("resize", reflow)
    window.addEventListener("scroll", reflow, true)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      if (timer) window.clearTimeout(timer)
      window.removeEventListener("resize", reflow)
      window.removeEventListener("scroll", reflow, true)
    }
  }, [active, isMobile, setMobileOpen, current.target])

  // Keyboard nav: Escape always skips; arrows only when not typing somewhere.
  React.useEffect(() => {
    if (!active) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        end()
        return
      }
      if (isTypingTarget(e.target)) return
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, STEPS.length - 1))
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0))
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active, end])

  if (!active) return null

  const panels = rect
    ? [
        { top: 0, left: 0, width: window.innerWidth, height: Math.max(rect.top, 0) },
        {
          top: rect.top + rect.height,
          left: 0,
          width: window.innerWidth,
          height: Math.max(window.innerHeight - (rect.top + rect.height), 0),
        },
        { top: rect.top, left: 0, width: Math.max(rect.left, 0), height: rect.height },
        {
          top: rect.top,
          left: rect.left + rect.width,
          width: Math.max(window.innerWidth - (rect.left + rect.width), 0),
          height: rect.height,
        },
      ]
    : [{ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }]

  return (
    <AnimatePresence>
      <motion.div
        key="dashboard-tour"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {panels.map((p, i) => (
          <div
            key={i}
            className="fixed z-[100] bg-background/70 backdrop-blur-sm pointer-events-auto transition-all duration-300 ease-out"
            style={p}
          />
        ))}

        {rect && (
          <div
            className="fixed z-[100] rounded-lg border-2 border-primary pointer-events-none transition-all duration-300 ease-out"
            style={{
              ...rect,
              boxShadow: "0 0 0 4px color-mix(in oklch, var(--primary) 20%, transparent)",
            }}
          />
        )}

        <div
          className="fixed z-[101] w-80 transition-all duration-300 ease-out"
          style={cardStyle(rect)}
        >
          <Card className="relative">
            <CardHeader className="pr-10">
              <div className="mb-1 flex size-8 items-center justify-center rounded-lg border border-border bg-muted">
                <current.icon className="size-4 text-foreground" />
              </div>
              <CardTitle>{current.title}</CardTitle>
              <CardDescription>{current.description}</CardDescription>
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-3 top-3"
                onClick={end}
                aria-label="Skip tour"
              >
                <X />
              </Button>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-1.5">
                {STEPS.map((s, i) => (
                  <span
                    key={s.title}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      i <= step ? "bg-primary" : "bg-muted",
                    )}
                  />
                ))}
              </div>
            </CardContent>

            <CardFooter className="justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                className={step === 0 ? "invisible" : undefined}
              >
                Back
              </Button>
              <Button size="sm" onClick={() => (isLast ? end() : setStep((s) => s + 1))}>
                {isLast ? "Done" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
