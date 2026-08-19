"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { StarIcon } from "lucide-react"
import type { FileRecord } from "@/lib/api"
import { getDownloadUrl } from "@/lib/api"
import { formatTime, initialsOf } from "@/lib/format"
import { useSession } from "@/lib/auth-client"
import { FileTypeBadge, FileTypeIcon } from "@/components/shared/file-icon"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RowActions } from "@/components/dashboard/file-table"

interface FileGridProps {
  files: FileRecord[]
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

function FileThumbnail({ file, onPreview }: { file: FileRecord; onPreview: () => void }) {
  const isImage = file.mimeType.startsWith("image/")
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!isImage) return
    let ignore = false
    getDownloadUrl(file.id)
      .then((res) => !ignore && setUrl(res.url))
      .catch(() => {})
    return () => {
      ignore = true
    }
  }, [file.id, isImage])

  return (
    <button
      onClick={onPreview}
      className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-t-[13px] border-b border-lavender-mist bg-void-plum"
    >
      {isImage && url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={file.originalName} className="size-full object-cover" />
      ) : (
        <FileTypeIcon mimeType={file.mimeType} className="size-10 text-laser-violet" />
      )}
      {file.starred && (
        <StarIcon className="absolute top-2 right-2 size-4 fill-laser-violet text-laser-violet drop-shadow" />
      )}
    </button>
  )
}

export function FileGrid({
  files,
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {files.map((file, index) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(index, 10) * 0.03 }}
          className="group/card flex flex-col overflow-hidden rounded-[14px] border border-lavender-mist bg-eclipse-black text-paper-white transition-all duration-200 hover:border-laser-violet hover:bg-void-plum/60"
        >
          <div className="flex items-center gap-2 p-3">
            <FileTypeBadge mimeType={file.mimeType} className="size-6 shrink-0 rounded-md" />
            <button onClick={() => onPreview(file)} className="min-w-0 flex-1 text-left">
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

          <FileThumbnail file={file} onPreview={() => onPreview(file)} />

          <div className="flex items-center gap-2 p-3">
            <Avatar className="size-6 shrink-0 border border-lavender-mist">
              <AvatarFallback className="bg-carbon-ink text-[9px] font-mono font-medium text-laser-violet">
                {initialsOf(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <p className="truncate font-mono text-[11px] text-ash-wisp">
              {file.sharedBy ? `Shared by ${file.sharedBy.name}` : "You uploaded"} · {formatTime(file.createdAt)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
