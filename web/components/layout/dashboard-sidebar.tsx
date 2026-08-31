"use client"

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  HomeIcon,
  FolderIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
  Trash2Icon,
  SettingsIcon,
  PanelLeftIcon,
  PlusIcon,
  FolderPlusIcon,
  UploadIcon,
  FolderUpIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useSidebarLayout } from "@/components/layout/sidebar-context"
import { useDrive } from "@/components/layout/drive-context"
import { FolderTree } from "@/components/layout/folder-tree"

type NavItem = { href: string; label: string; icon: LucideIcon; isActive: (path: string) => boolean }

const DRIVE_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: HomeIcon, isActive: (path) => path === "/dashboard" },
]

const ACTIVITY_ITEMS: NavItem[] = [
  { href: "/dashboard/shared", label: "Shared with me", icon: UsersIcon, isActive: (path) => path === "/dashboard/shared" },
  { href: "/dashboard/recent", label: "Recent", icon: ClockIcon, isActive: (path) => path === "/dashboard/recent" },
  { href: "/dashboard/starred", label: "Starred", icon: StarIcon, isActive: (path) => path === "/dashboard/starred" },
]

const SYSTEM_ITEMS: NavItem[] = [
  { href: "/dashboard/trash", label: "Trash", icon: Trash2Icon, isActive: (path) => path === "/dashboard/trash" },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon, isActive: (path) => path === "/dashboard/settings" },
]

function NavRow({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const row = (
    <Link
      href={item.href}
      className={cn(
        "relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]",
        collapsed && "justify-center px-0",
        active ? "bg-cream-canvas font-medium text-laser-violet shadow-[0_0_12px_rgba(185,151,255,0.15)]" : "text-silver-smoke hover:bg-cream-canvas/60 hover:text-ink-black",
      )}
    >
      <item.icon className={cn("size-4 shrink-0", active ? "text-laser-violet" : "text-silver-smoke")} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )

  if (!collapsed) return row

  return (
    <Tooltip>
      <TooltipTrigger render={row} />
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

function NewButton({ collapsed }: { collapsed: boolean }) {
  const drive = useDrive()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  if (!drive.activeFolderId) return null

  const trigger = (
    <Button
      variant="secondary"
      data-tour="tour-new"
      className={cn(
        "gap-2 rounded-xl bg-cream-canvas text-ink-black hover:bg-cream-canvas/80",
        collapsed ? "size-10 p-0" : "w-full justify-start",
      )}
    >
      <PlusIcon className="size-4" />
      {!collapsed && "New"}
    </Button>
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent align="start" side={collapsed ? "right" : "bottom"}>
          <DropdownMenuItem onClick={() => drive.requestNewFolder()}>
            <FolderPlusIcon />
            New folder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <UploadIcon />
            File upload
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => folderInputRef.current?.click()}>
            <FolderUpIcon />
            Folder upload
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length && drive.activeFolderId) drive.uploadFiles(e.target.files, drive.activeFolderId)
          e.target.value = ""
        }}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        // @ts-expect-error non-standard attribute, widely supported for directory picking
        webkitdirectory=""
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length && drive.activeFolderId) drive.uploadFiles(e.target.files, drive.activeFolderId)
          e.target.value = ""
        }}
      />
    </>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { collapsed, toggleCollapsed, isMobile, mobileOpen, setMobileOpen } = useSidebarLayout()

  const body = (
    <div className={cn("flex h-screen flex-col border-r border-lavender-mist/80 bg-eclipse-black/80 backdrop-blur-2xl", collapsed ? "w-20" : "w-64")}>
      <div className={cn("flex flex-col gap-4 p-4", collapsed && "items-center px-0")}>
        {collapsed ? (
          <div className="group relative flex size-9 shrink-0 items-center justify-center">
            <Link
              href="/dashboard"
              className="flex size-9 items-center justify-center transition-opacity group-hover:opacity-0"
            >
              <Logo className="h-7 w-auto shrink-0 text-ink-black" />
            </Link>
            <button
              type="button"
              aria-label="Expand sidebar"
              onClick={toggleCollapsed}
              className="absolute inset-0 flex items-center justify-center rounded-lg text-silver-smoke opacity-0 transition-opacity hover:text-ink-black group-hover:opacity-100"
            >
              <PanelLeftIcon className="size-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
              <Logo className="h-7 w-auto shrink-0 text-ink-black" />
              <span className="truncate text-xl font-freckle tracking-wide text-ink-black">Silo</span>
            </Link>
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={toggleCollapsed}
              className="shrink-0 rounded-lg p-1.5 text-silver-smoke hover:bg-cream-canvas/60 hover:text-ink-black"
            >
              <PanelLeftIcon className="size-4" />
            </button>
          </div>
        )}

        <NewButton collapsed={collapsed} />
      </div>

      <div className={cn("flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 no-scrollbar", collapsed && "items-center px-3 gap-3")}>
        {/* Group 1: Drive (Home + My Drive) */}
        <div className={cn("flex flex-col gap-1", collapsed && "w-full items-center")}>
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-ash-wisp">
              Drive
            </span>
          )}
          {DRIVE_ITEMS.map((item) => (
            <div key={item.href} className={collapsed ? "w-full" : undefined}>
              <NavRow item={item} active={item.isActive(pathname)} collapsed={collapsed} />
            </div>
          ))}
          {collapsed ? (
            <NavRow
              item={{ href: "/dashboard", label: "My Drive", icon: FolderIcon, isActive: () => false }}
              active={pathname.startsWith("/dashboard/folder")}
              collapsed
            />
          ) : (
            <FolderTree />
          )}
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-lavender-mist/40" />

        {/* Group 2: Activity & Shared (Shared, Recent, Starred) */}
        <div data-tour="tour-activity" className={cn("flex flex-col gap-1", collapsed && "w-full items-center")}>
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-ash-wisp">
              Activity
            </span>
          )}
          {ACTIVITY_ITEMS.map((item) => (
            <div key={item.href} className={collapsed ? "w-full" : undefined}>
              <NavRow item={item} active={item.isActive(pathname)} collapsed={collapsed} />
            </div>
          ))}
        </div>
      </div>

      {/* Pinned to bottom: System & Preferences (Trash, Settings) */}
      <div className={cn("flex flex-col gap-1 border-t border-lavender-mist/40 px-4 py-3", collapsed && "items-center px-3")}>
        {!collapsed && (
          <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-ash-wisp">
            System
          </span>
        )}
        <div data-tour="tour-system" className={cn("flex flex-col gap-1", collapsed && "w-full items-center")}>
          {SYSTEM_ITEMS.map((item) => (
            <div key={item.href} className={collapsed ? "w-full" : undefined}>
              <NavRow item={item} active={item.isActive(pathname)} collapsed={collapsed} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60"
            />
          )}
        </AnimatePresence>
        <motion.div
          initial={false}
          animate={{ x: mobileOpen ? 0 : "-100%" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-y-0 left-0 z-50"
        >
          {body}
        </motion.div>
      </>
    )
  }

  return <TooltipProvider>{body}</TooltipProvider>
}
