"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, UsersIcon, StarIcon, SettingsIcon, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAssistant } from "@/components/layout/assistant-context"
import { SilviOrb } from "@/components/assistant/silvi-orb"

type NavItem = { href: string; label: string; icon: LucideIcon; isActive: (path: string) => boolean }

const LEFT_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: HomeIcon, isActive: (path) => path === "/dashboard" },
  { href: "/dashboard/shared", label: "Shared", icon: UsersIcon, isActive: (path) => path === "/dashboard/shared" },
]

const RIGHT_ITEMS: NavItem[] = [
  { href: "/dashboard/starred", label: "Starred", icon: StarIcon, isActive: (path) => path === "/dashboard/starred" },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon, isActive: (path) => path === "/dashboard/settings" },
]

function NavTab({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <item.icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
      {item.label}
    </Link>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const { open, toggle, status } = useAssistant()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 h-16 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="relative grid h-full grid-cols-5 items-center">
        {LEFT_ITEMS.map((item) => (
          <NavTab key={item.href} item={item} active={item.isActive(pathname)} />
        ))}

        <div aria-hidden="true" />

        {RIGHT_ITEMS.map((item) => (
          <NavTab key={item.href} item={item} active={item.isActive(pathname)} />
        ))}

        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle Silvi Assistant"
          aria-expanded={open}
          className={cn(
            "absolute left-1/2 top-0 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card shadow-lg ring-1 ring-border transition-transform active:scale-95",
            open && "ring-2 ring-primary/40",
          )}
        >
          <SilviOrb status={status} size={34} showGlow={status !== "idle"} interactive={false} />
        </button>
      </div>
    </nav>
  )
}
