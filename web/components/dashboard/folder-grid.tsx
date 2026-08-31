"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon, StarIcon, StarOffIcon } from "lucide-react"
import type { FolderRecord } from "@/lib/api"
import { formatRelativeTime } from "@/lib/format"
import { Button } from "@/components/ui/button"
import FolderComponent from "@/components/ui/folder-component"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface FolderGridProps {
  folders: FolderRecord[]
  onRename: (folder: FolderRecord) => void
  onTrash: (folder: FolderRecord) => void
  onToggleStar: (folder: FolderRecord) => void
  onDropFile?: (fileId: string, targetFolderId: string) => void
}

export function FolderGlyph({ className, empty = false }: { className?: string; empty?: boolean }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      {/* Back folder tab — stays put as the anchor */}
      <path
        d="M32 32 H176 C186 32 194 36 200 44 L216 66 C222 74 230 78 240 78 H480 C497 78 512 93 512 110 V208 H16 V64 C16 47 22 32 32 32 Z"
        fill="#5B9DF5"
      />
      {/* Document/paper peeking out — slides up on hover, omitted when empty */}
      {!empty && (
        <rect
          x="48"
          y="120"
          rx="14"
          ry="14"
          width="416"
          height="180"
          fill="#E8ECEF"
          className="transition-transform duration-300 ease-out group-hover/card:-translate-y-3"
        />
      )}
      {/* Front folder — slides down on hover, opening up to reveal the folder's contents */}
      <path
        d="M32 208 H336 C344 208 352 204 358 197 L372 181 C382 170 396 164 410 164 H480 C497 164 512 178 512 195 V448 C512 465 497 480 480 480 H32 C15 480 0 465 0 448 V240 C0 223 15 208 32 208 Z"
        fill="#8DCBFB"
        className="transition-transform duration-300 ease-out group-hover/card:translate-y-2"
      />
    </svg>
  )
}

export function FolderGrid({ folders, onRename, onTrash, onToggleStar, onDropFile }: FolderGridProps) {
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null)

  if (folders.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
      {folders.map((folder, index) => {
        const isDragOver = dragOverFolderId === folder.id

        return (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(index, 10) * 0.03 }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (dragOverFolderId !== folder.id) setDragOverFolderId(folder.id)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (dragOverFolderId === folder.id) setDragOverFolderId(null)
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragOverFolderId(null)
              const fileId = e.dataTransfer.getData("application/silo-file-id") || e.dataTransfer.getData("text/plain")
              if (fileId && onDropFile) {
                onDropFile(fileId, folder.id)
              }
            }}
            className={cn(
              "group/card relative flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-colors duration-200 hover:bg-muted/60",
              isDragOver && "bg-accent ring-2 ring-primary/60"
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-2 top-2 shrink-0 text-muted-foreground opacity-0 group-hover/card:opacity-100 data-[popup-open]:opacity-100 hover:text-foreground"
                  >
                    <MoreHorizontalIcon />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRename(folder)}>
                  <PencilIcon data-icon="inline-start" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStar(folder)}>
                  {folder.starred ? <StarOffIcon data-icon="inline-start" /> : <StarIcon data-icon="inline-start" />}
                  {folder.starred ? "Remove from starred" : "Add to starred"}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => onTrash(folder)}>
                  <Trash2Icon data-icon="inline-start" />
                  Move to trash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href={`/dashboard/folder/${folder.id}`} className="flex flex-col items-center gap-2">
              <div className="relative h-[122px] w-36">
                <FolderComponent color="brand" size="xs" empty={folder.itemCount === 0} openOnClick={false} />
                {folder.starred && (
                  <StarIcon className="absolute -right-1 -top-1 size-4 fill-primary text-primary drop-shadow z-10" />
                )}
              </div>
              <span className="line-clamp-1 max-w-full text-sm font-semibold text-foreground group-hover/card:text-primary transition-colors">
                {folder.name}
              </span>
              <span className="text-xs text-muted-foreground">
                Created {formatRelativeTime(folder.createdAt)}
              </span>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
