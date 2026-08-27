"use client"

import * as React from "react"
import {
  BellIcon,
  CheckCheckIcon,
  Trash2Icon,
  Share2Icon,
  XIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { NotificationBell } from "@/components/ui/notification-bell"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/format"
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type NotificationRecord,
} from "@/lib/api"

// First polling loop in the app — keep it to this one interval, only while
// mounted, no new dependency.
const POLL_INTERVAL_MS = 45_000

function getIcon(type: string) {
  switch (type) {
    case "file_shared":
      return <Share2Icon className="size-4 text-primary" />
    default:
      return <BellIcon className="size-4 text-muted-foreground" />
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<NotificationRecord[] | null>(null)
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  const [open, setOpen] = React.useState(false)

  const refresh = React.useCallback(async () => {
    try {
      const { items, unreadCount } = await listNotifications()
      setNotifications(items)
      setUnreadCount(unreadCount)
    } catch {
      // Silent — this also runs on a background poll; a loud failure here
      // would be noise. The dropdown just keeps showing the last-known state.
    }
  }, [])

  React.useEffect(() => {
    refresh()
    const interval = setInterval(refresh, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refresh])

  React.useEffect(() => {
    if (open) refresh()
  }, [open, refresh])

  async function markAsRead(id: string) {
    const target = notifications?.find((n) => n.id === id)
    if (!target || target.read) return

    setNotifications((prev) => prev?.map((n) => (n.id === id ? { ...n, read: true } : n)) ?? prev)
    setUnreadCount((c) => Math.max(0, c - 1))

    try {
      await markNotificationRead(id)
    } catch {
      toast.error("Could not update notification")
      refresh()
    }
  }

  async function removeNotification(id: string) {
    const target = notifications?.find((n) => n.id === id)
    setNotifications((prev) => prev?.filter((n) => n.id !== id) ?? prev)
    if (target && !target.read) setUnreadCount((c) => Math.max(0, c - 1))

    try {
      await deleteNotification(id)
      toast.success("Notification removed")
    } catch {
      toast.error("Could not remove notification")
      refresh()
    }
  }

  async function markAllAsRead() {
    if (unreadCount === 0) return
    setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? prev)
    setUnreadCount(0)

    try {
      await markAllNotificationsRead()
      toast.success("All notifications marked as read")
    } catch {
      toast.error("Could not mark all as read")
      refresh()
    }
  }

  async function clearAll() {
    if (!notifications || notifications.length === 0) return
    const ids = notifications.map((n) => n.id)
    setNotifications([])
    setUnreadCount(0)

    try {
      // No bulk-delete endpoint — reuse the existing per-id one.
      await Promise.all(ids.map((id) => deleteNotification(id)))
      toast.success("All notifications cleared")
    } catch {
      toast.error("Could not clear all notifications")
      refresh()
    }
  }

  const filtered = (notifications ?? []).filter((n) => (filter === "unread" ? !n.read : true))

  const trigger = (
    <NotificationBell
      count={unreadCount}
      size={36}
      color="violet"
      aria-label="Open notifications"
      className={cn(
        "hover:bg-muted/60 transition-all",
        open && "border-primary/30 bg-accent text-primary"
      )}
    />
  )

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger render={<DropdownMenuTrigger render={trigger} />} />
        <TooltipContent side="bottom" align="end" className="text-xs">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-chart-2 ml-1.5 font-medium">({unreadCount} unread)</span>
          )}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 md:w-96 rounded-xl border border-border bg-card p-0 shadow-lg text-foreground overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-chart-2/10 text-chart-2 font-medium border-0">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[11px] font-medium text-chart-2 hover:underline transition-colors"
            >
              <CheckCheckIcon className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 border-b border-border/40 px-4 py-2 bg-muted/10 text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-all text-xs",
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All ({notifications?.length ?? 0})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-all text-xs",
              filter === "unread"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          <AnimatePresence mode="wait" initial={false}>
            {notifications === null ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-2 p-3.5"
              >
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center py-8 text-center px-4"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-accent text-primary mb-2">
                  <CheckCheckIcon className="size-5" />
                </div>
                <span className="text-xs font-semibold text-foreground">All caught up!</span>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
                  {filter === "unread"
                    ? "No unread notifications at the moment."
                    : "You have no notifications in your history."}
                </p>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                <AnimatePresence initial={false}>
                  {filtered.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      onClick={() => markAsRead(item.id)}
                      className={cn(
                        "group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left",
                        item.read
                          ? "bg-card hover:bg-muted/40"
                          : "bg-chart-2/5 hover:bg-chart-2/10"
                      )}
                    >
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border/80 shadow-xs">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            "truncate text-xs text-foreground",
                            !item.read ? "font-semibold" : "font-medium"
                          )}>
                            {item.title}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {item.body}
                        </p>
                      </div>
                      {!item.read && (
                        <span className="size-2 shrink-0 rounded-full bg-chart-2 self-center" />
                      )}
                      <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(item.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all rounded-xs hover:bg-destructive/10 shrink-0 self-center"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {notifications !== null && notifications.length > 0 && (
          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5 text-[11px]">
            <span className="text-muted-foreground">
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors font-medium"
            >
              <Trash2Icon className="size-3" />
              Clear all
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
