"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon, FolderIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { listFolder, type FolderRecord } from "@/lib/api"

function FolderTreeNode({ folder, depth }: { folder: FolderRecord; depth: number }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)
  const [children, setChildren] = useState<FolderRecord[] | null>(null)
  const [loading, setLoading] = useState(false)

  const href = `/dashboard/folder/${folder.id}`
  const active = pathname === href

  function toggle() {
    const next = !expanded
    setExpanded(next)
    if (next && children === null) {
      setLoading(true)
      listFolder(folder.id)
        .then((res) => setChildren(res.folders))
        .catch(() => setChildren([]))
        .finally(() => setLoading(false))
    }
  }

  return (
    <div>
      <div
        className={cn(
          "group flex h-9 items-center gap-1 rounded-lg pr-3 text-sm transition-colors",
          active ? "bg-cream-canvas font-medium text-laser-violet" : "text-silver-smoke hover:bg-cream-canvas/60 hover:text-ink-black",
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        <button
          type="button"
          aria-label={expanded ? "Collapse folder" : "Expand folder"}
          onClick={toggle}
          className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-cream-canvas"
        >
          <ChevronRightIcon className={cn("size-3.5 transition-transform", expanded && "rotate-90")} />
        </button>
        <Link href={href} className="flex min-w-0 flex-1 items-center gap-2">
          <FolderIcon className={cn("size-4 shrink-0", active ? "text-laser-violet" : "text-silver-smoke")} />
          <span className="truncate">{folder.name}</span>
        </Link>
      </div>
      {expanded && (
        <div>
          {loading && <div className="py-1 text-xs text-ash-wisp" style={{ paddingLeft: 8 + (depth + 1) * 16 }}>Loading…</div>}
          {children?.map((child) => <FolderTreeNode key={child.id} folder={child} depth={depth + 1} />)}
        </div>
      )}
    </div>
  )
}

export function FolderTree() {
  const [expanded, setExpanded] = useState(false)
  const [children, setChildren] = useState<FolderRecord[] | null>(null)
  const [loading, setLoading] = useState(false)

  // Root row itself is never "active" — Home owns the /dashboard highlight;
  // this row only lights up once you're browsing into an actual subfolder.
  const active = false

  function toggle() {
    const next = !expanded
    setExpanded(next)
    if (next && children === null) {
      setLoading(true)
      listFolder("root")
        .then((res) => setChildren(res.folders))
        .catch(() => setChildren([]))
        .finally(() => setLoading(false))
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex h-9 items-center gap-1 rounded-lg pr-3 text-sm transition-colors",
          active ? "bg-cream-canvas font-medium text-laser-violet" : "text-silver-smoke hover:bg-cream-canvas/60 hover:text-ink-black",
        )}
      >
        <button
          type="button"
          aria-label={expanded ? "Collapse My Drive" : "Expand My Drive"}
          onClick={toggle}
          className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-cream-canvas"
        >
          <ChevronRightIcon className={cn("size-3.5 transition-transform", expanded && "rotate-90")} />
        </button>
        <Link href="/dashboard" className="flex min-w-0 flex-1 items-center gap-2">
          <FolderIcon className={cn("size-4 shrink-0", active ? "text-laser-violet" : "text-silver-smoke")} />
          <span className="truncate">My Drive</span>
        </Link>
      </div>
      {expanded && (
        <div>
          {loading && <div className="py-1 text-xs text-ash-wisp" style={{ paddingLeft: 24 }}>Loading…</div>}
          {children?.map((child) => <FolderTreeNode key={child.id} folder={child} depth={1} />)}
        </div>
      )}
    </div>
  )
}
