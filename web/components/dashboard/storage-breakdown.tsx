"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ImageIcon,
  VideoIcon,
  MusicIcon,
  FileTextIcon,
  ArchiveIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ZapIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatBytes } from "@/lib/format"
import { listFiles, type FileRecord } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

const TOTAL_CAP_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB

type FileCategory = {
  label: string
  color: string
  bgColor: string
  icon: React.ElementType
  mimePatterns: RegExp[]
  extPatterns?: RegExp
}

const CATEGORIES: FileCategory[] = [
  {
    label: "Images",
    color: "#f97316",
    bgColor: "bg-orange-500",
    icon: ImageIcon,
    mimePatterns: [/^image\//],
  },
  {
    label: "Videos",
    color: "#3b82f6",
    bgColor: "bg-blue-500",
    icon: VideoIcon,
    mimePatterns: [/^video\//],
  },
  {
    label: "Audio",
    color: "#a855f7",
    bgColor: "bg-purple-500",
    icon: MusicIcon,
    mimePatterns: [/^audio\//],
    extPatterns: /\.(mp3|wav|m4a|flac|ogg|aac|opus|wma)$/i,
  },
  {
    label: "Documents",
    color: "#22c55e",
    bgColor: "bg-green-500",
    icon: FileTextIcon,
    mimePatterns: [
      /^text\//,
      /pdf/,
      /msword/,
      /officedocument/,
      /presentation/,
      /spreadsheet/,
    ],
    extPatterns: /\.(pdf|doc|docx|ppt|pptx|xls|xlsx|txt|md|csv)$/i,
  },
  {
    label: "Archives",
    color: "#eab308",
    bgColor: "bg-yellow-500",
    icon: ArchiveIcon,
    mimePatterns: [/zip/, /tar/, /gzip/, /x-rar/, /7z/],
    extPatterns: /\.(zip|tar|gz|rar|7z|bz2)$/i,
  },
  {
    label: "Other",
    color: "#6b7280",
    bgColor: "bg-gray-500",
    icon: FileIcon,
    mimePatterns: [/.*/],
  },
]

function categoriseFile(file: FileRecord): string {
  for (const cat of CATEGORIES) {
    if (cat.label === "Other") continue
    const matchMime = cat.mimePatterns.some((p) => p.test(file.mimeType))
    const matchExt = cat.extPatterns ? cat.extPatterns.test(file.originalName) : false
    if (matchMime || matchExt) return cat.label
  }
  return "Other"
}

export function StorageBreakdown() {
  const [files, setFiles] = useState<FileRecord[] | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let ignore = false
    listFiles()
      .then((res) => {
        if (!ignore) setFiles(res.items ?? [])
      })
      .catch(() => {
        if (!ignore) setFiles([])
      })
    return () => {
      ignore = true
    }
  }, [])

  const breakdown = useMemo(() => {
    if (!files) return null
    const totals = new Map<string, { bytes: number; count: number }>()
    for (const cat of CATEGORIES) {
      totals.set(cat.label, { bytes: 0, count: 0 })
    }
    for (const file of files) {
      const label = categoriseFile(file)
      const cur = totals.get(label)!
      totals.set(label, { bytes: cur.bytes + file.sizeBytes, count: cur.count + 1 })
    }
    return totals
  }, [files])

  const usedBytes = useMemo(() => {
    if (!files) return 0
    return files.reduce((s, f) => s + f.sizeBytes, 0)
  }, [files])

  const fraction = Math.min(usedBytes / TOTAL_CAP_BYTES, 1)
  const pct = Math.round(fraction * 100)

  if (!files || !breakdown) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-lavender-mist bg-void-plum p-3">
        <Skeleton className="h-1.5 w-full rounded-full bg-lavender-mist" />
        <Skeleton className="h-3 w-24 rounded-full bg-lavender-mist" />
      </div>
    )
  }

  // Build segments for the segmented progress bar (only non-zero categories)
  const activeSegments = CATEGORIES.filter((c) => (breakdown.get(c.label)?.bytes ?? 0) > 0)

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-lavender-mist bg-void-plum overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between px-3 pt-3 cursor-pointer"
      >
        <span className="text-xs font-medium text-paper-white">Storage</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-laser-violet">{pct}%</span>
          {expanded ? (
            <ChevronUpIcon className="size-3.5 text-silver-smoke" />
          ) : (
            <ChevronDownIcon className="size-3.5 text-silver-smoke" />
          )}
        </div>
      </button>

      {/* Segmented progress bar */}
      <div className="mx-3 flex h-1.5 overflow-hidden rounded-full bg-carbon-ink">
        {activeSegments.map((cat) => {
          const bytes = breakdown.get(cat.label)?.bytes ?? 0
          const segFraction = bytes / TOTAL_CAP_BYTES
          return (
            <div
              key={cat.label}
              className="h-full transition-all duration-500"
              style={{ width: `${segFraction * 100}%`, backgroundColor: cat.color }}
            />
          )
        })}
      </div>

      {/* Used / Total */}
      <p className="px-3 pb-3 font-mono text-[11px] text-ash-wisp">
        {formatBytes(usedBytes)} / {formatBytes(TOTAL_CAP_BYTES)} used
      </p>

      {/* Expanded breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-lavender-mist"
          >
            <div className="flex flex-col gap-0.5 px-3 py-2">
              {CATEGORIES.map((cat) => {
                const { bytes, count } = breakdown.get(cat.label) ?? { bytes: 0, count: 0 }
                if (bytes === 0) return null
                const catFraction = bytes / Math.max(usedBytes, 1)
                return (
                  <div key={cat.label} className="flex flex-col gap-1 py-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <cat.icon className="size-3.5" style={{ color: cat.color }} />
                        <span className="font-mono text-[11px] text-paper-white">{cat.label}</span>
                        <span className="font-mono text-[10px] text-ash-wisp">
                          {count} {count === 1 ? "file" : "files"}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-ash-wisp">{formatBytes(bytes)}</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-carbon-ink">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${catFraction * 100}%` }}
                        transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                )
              })}

              {/* Upgrade CTA if > 70% full */}
              {pct >= 70 && (
                <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-laser-violet/30 bg-laser-violet/10 px-2 py-1.5">
                  <ZapIcon className="size-3.5 shrink-0 text-laser-violet" />
                  <p className="font-mono text-[10px] text-laser-violet leading-tight">
                    Storage is {pct}% full — consider upgrading for more space.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
