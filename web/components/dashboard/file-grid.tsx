"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { StarIcon, CheckIcon } from "lucide-react"
import type { FileRecord } from "@/lib/api"
import { getDownloadUrl } from "@/lib/api"
import { formatTime, initialsOf } from "@/lib/format"
import { useSession } from "@/lib/auth-client"
import { FileTypeBadge, FileTypeIcon } from "@/components/shared/file-icon"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RowActions } from "@/components/dashboard/file-table"
import { getAudioCoverArt } from "@/lib/audio-metadata"
import { cn } from "@/lib/utils"

interface FileGridProps {
  files: FileRecord[]
  selectedIds?: Set<string>
  onToggleSelect?: (fileId: string) => void
  onHoverFile?: (fileId: string | null) => void
  onPreview: (file: FileRecord) => void
  onDownload: (file: FileRecord) => void
  onCopyLink: (file: FileRecord) => void
  onDelete: (file: FileRecord) => void
  onRename: (file: FileRecord) => void
  onShare: (file: FileRecord) => void
  onShowInfo: (file: FileRecord) => void
  onMove: (file: FileRecord) => void
  onToggleStar: (file: FileRecord) => void
  readOnly?: boolean
}

function FileThumbnail({
  file,
  isSelected,
  onToggleSelect,
  onPreview,
}: {
  file: FileRecord
  isSelected?: boolean
  onToggleSelect?: () => void
  onPreview: () => void
}) {
  const isImage = file.mimeType.startsWith("image/")
  const isAudio = file.mimeType.startsWith("audio/") || /\.(mp3|wav|m4a|flac|ogg|aac|opus|wma)$/i.test(file.originalName)
  const isVideo = file.mimeType.startsWith("video/")

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    if (isImage) {
      getDownloadUrl(file.id, true)
        .then((res) => !ignore && setImageUrl(res.url))
        .catch(() => {})
    } else if (isAudio) {
      getDownloadUrl(file.id, true)
        .then(async (res) => {
          if (ignore) return
          const meta = await getAudioCoverArt(file.id, res.url)
          if (!ignore && meta?.coverUrl) {
            setImageUrl(meta.coverUrl)
          }
        })
        .catch(() => {})
    } else if (isVideo) {
      getDownloadUrl(file.id, true)
        .then((res) => !ignore && setVideoUrl(res.url))
        .catch(() => {})
    }

    return () => {
      ignore = true
    }
  }, [file.id, isImage, isAudio, isVideo])

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[13px] border-b border-lavender-mist bg-void-plum group/thumb">
      <button
        type="button"
        onClick={onPreview}
        className="size-full flex items-center justify-center cursor-pointer"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={file.originalName} className="size-full object-cover transition-transform duration-300 group-hover/thumb:scale-105" />
        ) : isVideo && videoUrl ? (
          <video src={videoUrl} className="size-full object-cover" preload="metadata" />
        ) : (
          <FileTypeIcon mimeType={file.mimeType} className="size-10 text-laser-violet transition-transform duration-200 group-hover/thumb:scale-110" />
        )}
      </button>

      {/* Multi-Select Checkbox */}
      {onToggleSelect && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect()
          }}
          className={cn(
            "absolute top-2 left-2 z-10 flex size-5.5 items-center justify-center rounded-md border transition-all cursor-pointer",
            isSelected
              ? "border-laser-violet bg-laser-violet text-white shadow-md opacity-100"
              : "border-lavender-mist/80 bg-eclipse-black/80 text-transparent opacity-0 group-hover/thumb:opacity-100 hover:border-laser-violet"
          )}
          aria-label={isSelected ? "Deselect file" : "Select file"}
        >
          <CheckIcon className="size-3.5 stroke-[3]" />
        </button>
      )}

      {file.starred && (
        <StarIcon className="absolute top-2 right-2 size-4 fill-laser-violet text-laser-violet drop-shadow pointer-events-none" />
      )}
    </div>
  )
}

export function FileGrid({
  files,
  selectedIds = new Set(),
  onToggleSelect,
  onHoverFile,
  onPreview,
  onDownload,
  onCopyLink,
  onDelete,
  onRename,
  onShare,
  onShowInfo,
  onMove,
  onToggleStar,
  readOnly = false,
}: FileGridProps) {
  const { data: session } = useSession()

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
      {files.map((file, index) => {
        const isSelected = selectedIds.has(file.id)

        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(index, 10) * 0.03 }}
            className={cn(
              "group/card flex flex-col overflow-hidden rounded-[20px] border border-lavender-mist bg-eclipse-black text-paper-white transition-all duration-200 hover:border-laser-violet hover:bg-void-plum/60",
              isSelected && "border-laser-violet bg-void-plum ring-2 ring-laser-violet/70 shadow-[0_0_20px_rgba(185,151,255,0.2)]"
            )}
            onMouseEnter={() => onHoverFile?.(file.id)}
            onMouseLeave={() => onHoverFile?.(null)}
            onDragStart={(e) => {
              const dragEvent = e as unknown as React.DragEvent
              dragEvent.dataTransfer?.setData("application/silo-file-id", file.id)
              dragEvent.dataTransfer?.setData("text/plain", file.id)
            }}
          >
            <div className="flex items-center gap-2 p-3">
              <FileTypeBadge mimeType={file.mimeType} className="size-6 shrink-0 rounded-md" />
              <button onClick={() => onPreview(file)} className="min-w-0 flex-1 text-left cursor-pointer">
                <p className="truncate text-sm font-medium text-paper-white group-hover/card:text-laser-violet transition-colors">
                  {file.originalName}
                </p>
              </button>
              <RowActions
                file={file}
                onDownload={onDownload}
                onCopyLink={onCopyLink}
                onDelete={onDelete}
                onRename={onRename}
                onShare={onShare}
                onShowInfo={onShowInfo}
                onMove={onMove}
                onToggleStar={onToggleStar}
                readOnly={readOnly}
              />
            </div>

            <FileThumbnail
              file={file}
              isSelected={isSelected}
              onToggleSelect={onToggleSelect ? () => onToggleSelect(file.id) : undefined}
              onPreview={() => onPreview(file)}
            />

            <div className="flex items-center gap-2 p-3">
              <Avatar className="size-6 shrink-0 border border-lavender-mist">
                <AvatarFallback className="bg-carbon-ink text-[9px] font-mono font-medium text-laser-violet">
                  {initialsOf(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <p className="truncate font-mono text-[11px] text-ash-wisp">
                {file.sharedBy ? `Shared by ${file.sharedBy.name}` : "You uploaded"} · {formatTime(file.createdAt)}
              </p>
              <span className="ml-auto shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity font-mono text-[10px] px-1.5 py-0.5 rounded border border-lavender-mist text-ash-wisp select-none">
                Space
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
