"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PanelLeftIcon, LogOutIcon, SettingsIcon, HelpCircleIcon, ZapIcon } from "lucide-react"
import { toast } from "sonner"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useSidebarLayout } from "@/components/layout/sidebar-context"
import { useAssistant } from "@/components/layout/assistant-context"
import { NotificationCenter } from "@/components/layout/notification-center"
import { SilviOrb } from "@/components/assistant/silvi-orb"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"
import { initialsOf, formatBytes } from "@/lib/format"
import { authClient, useSession } from "@/lib/auth-client"
import { clearFileCache } from "@/lib/api"
import { useStorageUsage, STORAGE_CAP_BYTES } from "@/hooks/use-storage-usage"

function AccountMenu() {
  const router = useRouter()
  const { data: session } = useSession()
  const usedBytes = useStorageUsage()
  const usedPct = usedBytes === null ? 0 : Math.min(100, (usedBytes / STORAGE_CAP_BYTES) * 100)

  const trigger = (
    <button
      type="button"
      className="flex items-center gap-2.5 rounded-xl p-1 transition-all duration-200 hover:bg-muted/60 cursor-pointer hover:scale-105 active:scale-95"
    >
      <Avatar className="size-9 shrink-0 border border-border">
        <AvatarFallback className="bg-muted text-xs font-mono font-medium text-primary">
          {initialsOf(session?.user?.name)}
        </AvatarFallback>
      </Avatar>
    </button>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" className="w-72 p-0 overflow-hidden">
        <div className="flex items-center gap-3 p-3.5">
          <Avatar className="size-11 shrink-0 border border-border">
            <AvatarFallback className="bg-muted text-sm font-mono font-semibold text-primary">
              {initialsOf(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{session?.user?.name ?? "…"}</p>
            <p className="truncate text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>

        <div className="px-3.5 pb-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span>{usedBytes === null ? "…" : formatBytes(usedBytes)}</span>
            <span>{formatBytes(STORAGE_CAP_BYTES)}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usedPct}%` }} />
          </div>
        </div>

        <DropdownMenuSeparator className="mx-0" />

        <div className="p-1.5">
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast("Help & Support isn't set up yet")}>
            <HelpCircleIcon />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast("Storage upgrades aren't available yet")}>
            <ZapIcon />
            Upgrade storage
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-0" />

        <div className="p-1.5">
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              await authClient.signOut()
              clearFileCache()
              router.push("/login")
              router.refresh()
            }}
          >
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DashboardTopbar({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
  const { isMobile, toggleCollapsed } = useSidebarLayout()
  const { open, toggle } = useAssistant()

  const assistantTrigger = (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      data-tour="tour-assistant"
      className={cn(
        "group relative hidden h-9 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-all duration-200 cursor-pointer md:flex",
        open
          ? "border-[#b997ff]/60 bg-[#b997ff]/15 text-[#f1f0ec] shadow-[0_0_14px_rgba(185,151,255,0.25)] ring-1 ring-[#b997ff]/40"
          : "border-parchment-shadow bg-white/[0.04] text-[#f1f0ec] hover:border-[#00f575]/40 hover:bg-white/[0.08] hover:text-white",
      )}
      aria-label="Toggle Silvi Assistant"
      aria-expanded={open}
    >
      {/* Always reads as idle/Ready - the header inside the panel is the same,
          real progress still shows in the panel's own working indicator. */}
      <SilviOrb status="idle" size={18} showGlow={false} interactive={false} />
      <span className="font-semibold tracking-tight">Ask Silvi</span>
      <Kbd className="hidden md:inline-flex ml-0.5 h-4.5 px-1 text-[10px] bg-marigold-glow/30 text-[#a5a2a5] border border-parchment-shadow">
        ⌘J
      </Kbd>
    </Button>
  )

  return (
    <TooltipProvider>
      <header
        aria-label={typeof title === "string" ? title : undefined}
        className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/80 bg-card/75 backdrop-blur-2xl px-4 sticky top-0 z-30"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleCollapsed}
                className="text-muted-foreground hover:text-foreground"
              >
                <PanelLeftIcon />
              </Button>
              <Separator orientation="vertical" className="h-4 bg-border" />
            </>
          )}
          {children && <div className="min-w-0 flex-1 flex items-center gap-2">{children}</div>}
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <Tooltip>
            <TooltipTrigger render={assistantTrigger} />
            <TooltipContent side="bottom" align="end" className="text-xs">
              <span>Silvi AI Assistant</span>
              <span className="text-muted-foreground ml-1.5">(Ctrl+J)</span>
            </TooltipContent>
          </Tooltip>
          <NotificationCenter />
          <Separator orientation="vertical" className="hidden h-6 bg-border md:block" />
          <div className="hidden md:block">
            <AccountMenu />
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
