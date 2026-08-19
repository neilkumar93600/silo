"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  UploadCloudIcon,
  DownloadCloudIcon,
  XIcon,
  CheckIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  FileAudioIcon,
  FileVideoIcon,
  FileImageIcon,
  FileTextIcon,
  FileArchiveIcon,
  FileIcon,
} from "lucide-react"

import { useDrive, type QueueItem } from "@/components/layout/drive-context"
import { formatBytes } from "@/lib/format"
import { cn } from "@/lib/utils"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSpeed(bps: number) {
  if (bps <= 0) return ""
  if (bps >= 1_000_000) return `${(bps / 1_000_000).toFixed(1)} MB/s`
  if (bps >= 1_000) return `${(bps / 1_000).toFixed(0)} KB/s`
  return `${Math.round(bps)} B/s`
}

function formatEta(item: QueueItem) {
  if (item.progress <= 0 || item.speedBps <= 0) return ""
  const remaining = item.sizeBytes - item.uploadedBytes
  const sec = remaining / item.speedBps
  if (sec < 5) return "almost done"
  if (sec < 60) return `${Math.round(sec)}s`
  return `${Math.ceil(sec / 60)}m`
}

function MimeIcon({ mimeType, className }: { mimeType?: string; className?: string }) {
  const cls = cn("shrink-0", className)
  if (!mimeType) return <FileIcon className={cls} />
  if (mimeType.startsWith("image/")) return <FileImageIcon className={cn(cls, "text-orange-400")} />
  if (mimeType.startsWith("video/")) return <FileVideoIcon className={cn(cls, "text-blue-400")} />
  if (mimeType.startsWith("audio/")) return <FileAudioIcon className={cn(cls, "text-purple-400")} />
  if (mimeType.startsWith("text/") || /pdf|msword|officedocument/.test(mimeType))
    return <FileTextIcon className={cn(cls, "text-green-400")} />
  if (/zip|tar|gzip|rar|7z/.test(mimeType)) return <FileArchiveIcon className={cn(cls, "text-yellow-400")} />
  return <FileIcon className={cn(cls, "text-silver-smoke")} />
}

// ─── Single Row ────────────────────────────────────────────────────────────────

function QueueRow({
  item,
  onCancel,
  onDismiss,
}: {
  item: QueueItem
  onCancel: () => void
  onDismiss: () => void
}) {
  const isDone = item.status === "done"
  const isError = item.status === "error"
  const isCancelled = item.status === "cancelled"
  const isActive = item.status === "uploading"
  const pct = Math.round(item.progress * 100)
  const speed = formatSpeed(item.speedBps)
  const eta = formatEta(item)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, height: 0, marginTop: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-3 transition-colors",
        isDone
          ? "border-emerald-500/30 bg-emerald-500/5"
          : isError
            ? "border-red-500/30 bg-red-500/5"
            : isCancelled
              ? "border-lavender-mist/30 bg-carbon-ink/60"
              : "border-lavender-mist/60 bg-eclipse-black"
      )}
    >
      {/* Top row */}
      <div className="flex items-start gap-2">
        <MimeIcon mimeType={item.mimeType} className="mt-0.5 size-4" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium leading-tight text-paper-white">
            {item.name}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-ash-wisp">
            {formatBytes(item.sizeBytes)}
            {isActive && speed && ` · ${speed}`}
            {isActive && eta && ` · ${eta} left`}
            {isError && <span className="text-red-400"> · {item.error}</span>}
            {isCancelled && <span className="text-silver-smoke"> · Cancelled</span>}
          </p>
        </div>

        {/* Status badge / action button */}
        <div className="flex shrink-0 items-center gap-1.5">
          {isDone ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckIcon className="size-3" />
            </span>
          ) : isError || isCancelled ? (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={onDismiss}
              className="flex size-5 items-center justify-center rounded-full text-ash-wisp transition-colors hover:bg-void-plum hover:text-paper-white"
            >
              <XIcon className="size-3" />
            </button>
          ) : (
            <>
              <span className="font-mono text-[11px] font-medium tabular-nums text-laser-violet">
                {pct}%
              </span>
              <button
                type="button"
                aria-label="Cancel"
                onClick={onCancel}
                className="flex size-5 items-center justify-center rounded-full text-ash-wisp transition-colors hover:bg-void-plum hover:text-paper-white"
              >
                <XIcon className="size-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!isCancelled && (
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-carbon-ink">
          <motion.div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              isDone ? "bg-emerald-500" : isError ? "bg-red-500" : "bg-laser-violet"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
          {/* Shimmer on active */}
          {isActive && (
            <motion.div
              className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 0.4 }}
            />
          )}
        </div>
      )}
    </motion.div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

function QueueSection({
  label,
  icon: Icon,
  items,
  onCancel,
  onDismiss,
}: {
  label: string
  icon: React.ElementType
  items: QueueItem[]
  onCancel: (id: string) => void
  onDismiss: (id: string) => void
}) {
  const active = items.filter((i) => i.status === "uploading")
  const done = items.filter((i) => i.status === "done")
  const failed = items.filter((i) => i.status === "error" || i.status === "cancelled")

  const overallPct =
    active.length === 0
      ? 100
      : Math.round((active.reduce((s, i) => s + i.progress, 0) / active.length) * 100)

  const totalSpeed = active.reduce((s, i) => s + i.speedBps, 0)

  return (
    <div className="flex flex-col gap-2">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-laser-violet" />
        <span className="text-[12px] font-semibold text-paper-white">{label}</span>
        <span className="ml-auto font-mono text-[10px] text-silver-smoke">
          {done.length}/{items.length} done
          {totalSpeed > 0 && ` · ${formatSpeed(totalSpeed)}`}
        </span>
      </div>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <QueueRow
            key={item.id}
            item={item}
            onCancel={() => onCancel(item.id)}
            onDismiss={() => onDismiss(item.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── Panel ─────────────────────────────────────────────────────────────────────

export function UploadProgressPanel() {
  const { uploads, downloads, cancelUpload, cancelDownload } = useDrive()
  const [minimised, setMinimised] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set())

  const visibleUploads = useMemo(
    () => uploads.filter((u) => !dismissed.has(u.id)),
    [uploads, dismissed]
  )
  const visibleDownloads = useMemo(
    () => downloads.filter((d) => !dismissed.has(d.id)),
    [downloads, dismissed]
  )

  const totalItems = visibleUploads.length + visibleDownloads.length
  if (totalItems === 0) return null

  const activeCount = [...visibleUploads, ...visibleDownloads].filter(
    (i) => i.status === "uploading"
  ).length

  function handleDismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]))
  }

  function handleDismissAll() {
    const doneOrFailed = [...visibleUploads, ...visibleDownloads]
      .filter((i) => i.status !== "uploading")
      .map((i) => i.id)
    setDismissed((prev) => new Set([...prev, ...doneOrFailed]))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed right-4 bottom-4 z-50 flex w-[340px] flex-col overflow-hidden rounded-2xl border border-lavender-mist bg-void-plum shadow-2xl shadow-black/40"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 border-b border-lavender-mist/60 px-4 py-3">
        {activeCount > 0 ? (
          <div className="relative flex size-5 shrink-0 items-center justify-center">
            <UploadCloudIcon className="size-4 text-laser-violet" />
            {/* Pulsing ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-laser-violet/20" />
          </div>
        ) : (
          <CheckIcon className="size-4 shrink-0 text-emerald-400" />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-paper-white">
            {activeCount > 0
              ? `${activeCount} transfer${activeCount > 1 ? "s" : ""} in progress`
              : "All transfers complete"}
          </p>
          <p className="font-mono text-[10px] text-ash-wisp">
            {totalItems} {totalItems === 1 ? "file" : "files"} total
          </p>
        </div>

        <div className="flex items-center gap-1">
          {/* Dismiss all finished */}
          {activeCount < totalItems && (
            <button
              type="button"
              onClick={handleDismissAll}
              title="Clear completed"
              className="rounded-md px-2 py-1 font-mono text-[10px] text-ash-wisp transition-colors hover:bg-void-plum hover:text-paper-white"
            >
              Clear
            </button>
          )}
          {/* Minimise toggle */}
          <button
            type="button"
            aria-label={minimised ? "Expand" : "Minimise"}
            onClick={() => setMinimised((v) => !v)}
            className="flex size-7 items-center justify-center rounded-lg text-ash-wisp transition-colors hover:bg-void-plum hover:text-paper-white"
          >
            {minimised ? (
              <ChevronUpIcon className="size-4" />
            ) : (
              <MinusIcon className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <AnimatePresence initial={false}>
        {!minimised && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="flex max-h-[420px] flex-col gap-3 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-thumb-lavender-mist scrollbar-track-transparent"
          >
            {visibleUploads.length > 0 && (
              <QueueSection
                label="Uploads"
                icon={UploadCloudIcon}
                items={visibleUploads}
                onCancel={cancelUpload}
                onDismiss={handleDismiss}
              />
            )}

            {visibleUploads.length > 0 && visibleDownloads.length > 0 && (
              <div className="h-px w-full bg-lavender-mist/40" />
            )}

            {visibleDownloads.length > 0 && (
              <QueueSection
                label="Downloads"
                icon={DownloadCloudIcon}
                items={visibleDownloads}
                onCancel={cancelDownload}
                onDismiss={handleDismiss}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
