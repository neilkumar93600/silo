"use client"

import { motion, AnimatePresence } from "motion/react"
import {
  DownloadIcon,
  Trash2Icon,
  StarIcon,
  StarOffIcon,
  FolderInputIcon,
  XIcon,
  CheckSquareIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileRecord } from "@/lib/api"

interface BulkActionBarProps {
  selectedFiles: FileRecord[]
  onClearSelection: () => void
  onBulkDownload: () => void
  onBulkTrash: () => void
  onBulkToggleStar: () => void
  onBulkMove: () => void
  readOnly?: boolean
}

export function BulkActionBar({
  selectedFiles,
  onClearSelection,
  onBulkDownload,
  onBulkTrash,
  onBulkToggleStar,
  onBulkMove,
  readOnly = false,
}: BulkActionBarProps) {
  const count = selectedFiles.length
  if (count === 0) return null

  const allStarred = selectedFiles.every((f) => f.starred)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-lavender-mist/80 bg-eclipse-black/95 px-4 py-2.5 text-ink-black shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(185,151,255,0.25)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 pr-3 border-r border-lavender-mist/40">
          <CheckSquareIcon className="size-4 text-laser-violet" />
          <span className="font-mono text-xs font-semibold text-ink-black">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkDownload}
            className="h-8 gap-1.5 px-2.5 text-xs text-silver-smoke hover:bg-cream-canvas hover:text-ink-black cursor-pointer"
          >
            <DownloadIcon className="size-3.5" />
            <span>Download</span>
          </Button>

          {!readOnly && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkToggleStar}
                className="h-8 gap-1.5 px-2.5 text-xs text-silver-smoke hover:bg-cream-canvas hover:text-ink-black cursor-pointer"
              >
                {allStarred ? <StarOffIcon className="size-3.5 text-laser-violet" /> : <StarIcon className="size-3.5" />}
                <span>{allStarred ? "Unstar" : "Star"}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkMove}
                className="h-8 gap-1.5 px-2.5 text-xs text-silver-smoke hover:bg-cream-canvas hover:text-ink-black cursor-pointer"
              >
                <FolderInputIcon className="size-3.5" />
                <span>Move</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onBulkTrash}
                className="h-8 gap-1.5 px-2.5 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 cursor-pointer"
              >
                <Trash2Icon className="size-3.5" />
                <span>Delete</span>
              </Button>
            </>
          )}
        </div>

        <div className="pl-2 border-l border-lavender-mist/40">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClearSelection}
            className="size-7 rounded-lg text-silver-smoke hover:bg-cream-canvas hover:text-ink-black cursor-pointer"
            aria-label="Clear selection"
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
