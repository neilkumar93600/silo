"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ChevronLeftIcon, ChevronRightIcon, BellIcon, HelpCircleIcon, LogOutIcon, type LucideIcon } from "lucide-react"

import { authClient, useSession } from "@/lib/auth-client"
import { clearFileCache } from "@/lib/api"
import { initialsOf, formatBytes } from "@/lib/format"
import { useStorageUsage, STORAGE_CAP_BYTES } from "@/hooks/use-storage-usage"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function SettingsRow({
  icon: Icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium",
        destructive ? "text-destructive" : "text-foreground",
      )}
    >
      <Icon className="size-4.5 shrink-0" />
      <span className="flex-1">{label}</span>
      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
    </button>
  )
}

export function MobileSettings() {
  const router = useRouter()
  const { data: session } = useSession()
  const usedBytes = useStorageUsage()
  const usedPct = usedBytes === null ? 0 : Math.min(100, (usedBytes / STORAGE_CAP_BYTES) * 100)

  return (
    <div className="flex min-h-full flex-col md:hidden">
      <div className="relative flex h-14 shrink-0 items-center justify-center border-b border-border bg-card px-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          aria-label="Back"
          className="absolute left-4 flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <span className="text-sm font-semibold text-foreground">Settings</span>
      </div>

      <div className="flex items-center gap-3 p-4">
        <Avatar className="size-16 shrink-0 border border-border">
          <AvatarFallback className="bg-muted text-lg font-mono font-semibold text-primary">
            {initialsOf(session?.user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">{session?.user?.name ?? "…"}</p>
          <p className="truncate text-sm text-muted-foreground">{session?.user?.email}</p>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{usedBytes === null ? "…" : formatBytes(usedBytes)}</span>
          <span>{formatBytes(STORAGE_CAP_BYTES)}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usedPct}%` }} />
        </div>
      </div>

      <div className="px-4 pt-6">
        <p className="px-1 pb-2 text-xs font-medium text-muted-foreground">Account</p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <SettingsRow
            icon={LogOutIcon}
            label="Sign out"
            destructive
            onClick={async () => {
              await authClient.signOut()
              clearFileCache()
              router.push("/login")
              router.refresh()
            }}
          />
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          <SettingsRow
            icon={BellIcon}
            label="Notifications"
            onClick={() => {
              // Reuses the real notification center already in the header
              // rather than duplicating its popover as a full mobile page.
              document.querySelector<HTMLButtonElement>("button[aria-label='Open notifications']")?.click()
            }}
          />
          <SettingsRow
            icon={HelpCircleIcon}
            label="Help & Support"
            onClick={() => toast("Help & Support isn't set up yet")}
          />
        </div>
      </div>
    </div>
  )
}
