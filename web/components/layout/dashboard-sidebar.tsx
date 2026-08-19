"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  HomeIcon,
  FolderIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
  Trash2Icon,
  SettingsIcon,
  LogOutIcon,
  SearchIcon,
  PanelLeftIcon,
  PlusIcon,
  FolderPlusIcon,
  UploadIcon,
  FolderUpIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { initialsOf } from "@/lib/format"
import { authClient, useSession } from "@/lib/auth-client"
import { Logo } from "@/components/shared/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StorageMeter } from "@/components/dashboard/storage-meter"
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

const HOME_ITEM: NavItem = { href: "/dashboard", label: "Home", icon: HomeIcon, isActive: (path) => path === "/dashboard" }

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard/shared", label: "Shared with me", icon: UsersIcon, isActive: (path) => path === "/dashboard/shared" },
  { href: "/dashboard/recent", label: "Recent", icon: ClockIcon, isActive: (path) => path === "/dashboard/recent" },
  { href: "/dashboard/starred", label: "Starred", icon: StarIcon, isActive: (path) => path === "/dashboard/starred" },
  { href: "/dashboard/trash", label: "Trash", icon: Trash2Icon, isActive: (path) => path === "/dashboard/trash" },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon, isActive: (path) => path === "/dashboard/settings" },
]

function NavRow({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const row = (
    <Link
      href={item.href}
      className={cn(
        "relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition-colors",
        collapsed && "justify-center px-0",
        active ? "bg-void-plum font-medium text-laser-violet" : "text-silver-smoke hover:bg-void-plum/60 hover:text-paper-white",
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
      className={cn(
        "gap-2 rounded-xl bg-void-plum text-paper-white hover:bg-void-plum/80",
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
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { collapsed, toggleCollapsed, isMobile, mobileOpen, setMobileOpen } = useSidebarLayout()
  const [query, setQuery] = useState("")

  function submitSearch() {
    router.push(query.trim() ? `/dashboard?q=${encodeURIComponent(query.trim())}` : "/dashboard")
    if (isMobile) setMobileOpen(false)
  }

  const body = (
    <div className={cn("flex h-screen flex-col border-r border-lavender-mist bg-eclipse-black", collapsed ? "w-20" : "w-64")}>
      <div className={cn("flex flex-col gap-4 p-4", collapsed && "items-center px-0")}>
        {collapsed ? (
          <div className="group relative flex size-9 shrink-0 items-center justify-center">
            <Link
              href="/dashboard"
              className="flex size-9 items-center justify-center transition-opacity group-hover:opacity-0"
            >
              <Logo className="h-7 w-auto shrink-0 text-paper-white" />
            </Link>
            <button
              type="button"
              aria-label="Expand sidebar"
              onClick={toggleCollapsed}
              className="absolute inset-0 flex items-center justify-center rounded-lg text-silver-smoke opacity-0 transition-opacity hover:text-paper-white group-hover:opacity-100"
            >
              <PanelLeftIcon className="size-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
              <Logo className="h-7 w-auto shrink-0 text-paper-white" />
              <span className="truncate text-base font-semibold tracking-[-0.025em] text-paper-white">Silo</span>
            </Link>
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={toggleCollapsed}
              className="shrink-0 rounded-lg p-1.5 text-silver-smoke hover:bg-void-plum/60 hover:text-paper-white"
            >
              <PanelLeftIcon className="size-4" />
            </button>
          </div>
        )}

        <NewButton collapsed={collapsed} />

        {!collapsed && (
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ash-wisp" />
            <Input
              placeholder="Search files…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              className="border-lavender-mist bg-void-plum pl-8 text-paper-white placeholder:text-ash-wisp focus-visible:ring-laser-violet"
            />
          </div>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4", collapsed && "items-center px-3")}>
        <div className={collapsed ? "w-full" : undefined}>
          <NavRow item={HOME_ITEM} active={HOME_ITEM.isActive(pathname)} collapsed={collapsed} />
        </div>
        {collapsed ? (
          <NavRow
            item={{ href: "/dashboard", label: "My Drive", icon: FolderIcon, isActive: () => false }}
            active={pathname.startsWith("/dashboard/folder")}
            collapsed
          />
        ) : (
          <FolderTree />
        )}
        {NAV_ITEMS.map((item) => (
          <div key={item.href} className={collapsed ? "w-full" : undefined}>
            <NavRow item={item} active={item.isActive(pathname)} collapsed={collapsed} />
          </div>
        ))}
      </div>

      <div className={cn("flex flex-col gap-3 border-t border-lavender-mist/60 p-4", collapsed && "items-center px-3")}>
        {!collapsed && <StorageMeter />}

        {collapsed ? (
          <Avatar className="size-9 shrink-0 border border-lavender-mist">
            <AvatarFallback className="bg-carbon-ink text-xs font-mono font-medium text-laser-violet">
              {initialsOf(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-lavender-mist/60 bg-void-plum/60 px-3 py-2">
            <Avatar className="size-9 shrink-0 border border-lavender-mist">
              <AvatarFallback className="bg-carbon-ink text-xs font-mono font-medium text-laser-violet">
                {initialsOf(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold text-paper-white">{session?.user?.name ?? "…"}</span>
              <span className="truncate font-mono text-[10px] text-ash-wisp">{session?.user?.email}</span>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              onClick={async () => {
                await authClient.signOut()
                router.push("/login")
                router.refresh()
              }}
              className="ml-auto shrink-0 text-ash-wisp hover:text-paper-white"
            >
              <LogOutIcon className="size-4" />
            </button>
          </div>
        )}
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
