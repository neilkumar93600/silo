"use client"

import {
  MoreHorizontalIcon,
  DownloadIcon,
  Trash2Icon,
  LinkIcon,
  PencilIcon,
  Share2Icon,
  InfoIcon,
  FolderInputIcon,
  StarIcon,
  StarOffIcon,
  CheckIcon,
  SparklesIcon,
} from "lucide-react"
import type { FileRecord } from "@/lib/api"
import { formatBytes, formatDate } from "@/lib/format"
import { FileTypeBadge } from "@/components/shared/file-icon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAssistant } from "@/components/layout/assistant-context"
import { cn } from "@/lib/utils"

interface FileTableProps {
  files: FileRecord[]
  selectedIds?: Set<string>
  onToggleSelect?: (fileId: string) => void
  onToggleSelectAll?: () => void
  onPreview: (file: FileRecord) => void
  onToggleVisibility: (file: FileRecord) => void
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

export function RowActions({
  file,
  onDownload,
  onCopyLink,
  onDelete,
  onRename,
  onShare,
  onShowInfo,
  onMove,
  onToggleStar,
  readOnly = false,
}: { file: FileRecord } & Pick<
  FileTableProps,
  "onDownload" | "onCopyLink" | "onDelete" | "onRename" | "onShare" | "onShowInfo" | "onMove" | "onToggleStar" | "readOnly"
>) {
  const { askAboutFile } = useAssistant()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="text-silver-smoke hover:text-ink-black cursor-pointer">
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="border-lavender-mist bg-eclipse-black text-ink-black">
        <DropdownMenuItem onClick={() => askAboutFile(file)} className="hover:bg-cream-canvas hover:text-laser-violet text-laser-violet font-medium">
          <SparklesIcon data-icon="inline-start" className="size-4 text-laser-violet" />
          Ask Silvi
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload(file)} className="hover:bg-cream-canvas hover:text-laser-violet">
          <DownloadIcon data-icon="inline-start" />
          Download
        </DropdownMenuItem>
        {!readOnly && (
          <DropdownMenuItem onClick={() => onRename(file)} className="hover:bg-cream-canvas hover:text-laser-violet">
            <PencilIcon data-icon="inline-start" />
            Rename
          </DropdownMenuItem>
        )}
        {!readOnly && (
          <DropdownMenuItem onClick={() => onShare(file)} className="hover:bg-cream-canvas hover:text-laser-violet">
            <Share2Icon data-icon="inline-start" />
            Share
          </DropdownMenuItem>
        )}
        {!readOnly && (
          <DropdownMenuItem onClick={() => onMove(file)} className="hover:bg-cream-canvas hover:text-laser-violet">
            <FolderInputIcon data-icon="inline-start" />
            Move to folder
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onShowInfo(file)} className="hover:bg-cream-canvas hover:text-laser-violet">
          <InfoIcon data-icon="inline-start" />
          File information
        </DropdownMenuItem>
        {!readOnly && (
          <DropdownMenuItem onClick={() => onToggleStar(file)} className="hover:bg-cream-canvas hover:text-laser-violet">
            {file.starred ? <StarOffIcon data-icon="inline-start" /> : <StarIcon data-icon="inline-start" />}
            {file.starred ? "Remove from starred" : "Add to starred"}
          </DropdownMenuItem>
        )}
        {file.visibility === "public" && (
          <DropdownMenuItem onClick={() => onCopyLink(file)} className="hover:bg-cream-canvas hover:text-laser-violet">
            <LinkIcon data-icon="inline-start" />
            Copy share link
          </DropdownMenuItem>
        )}
        {!readOnly && (
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(file)}>
            <Trash2Icon data-icon="inline-start" />
            Move to trash
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function FileTable({
  files,
  selectedIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  onPreview,
  onToggleVisibility,
  onDownload,
  onCopyLink,
  onDelete,
  onRename,
  onShare,
  onShowInfo,
  onMove,
  onToggleStar,
  readOnly = false,
}: FileTableProps) {
  const selectableFiles = files.filter((f) => !f.sharedBy)
  const allSelected = selectableFiles.length > 0 && selectableFiles.every((f) => selectedIds.has(f.id))
  const someSelected = selectableFiles.some((f) => selectedIds.has(f.id))

  return (
    <>
      {/* Desktop */}
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow className="border-b border-lavender-mist hover:bg-transparent">
            {onToggleSelectAll && (
              <TableHead className="w-10 pl-4">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className={cn(
                    "flex size-4.5 items-center justify-center rounded-md border transition-all cursor-pointer",
                    allSelected
                      ? "border-laser-violet bg-laser-violet text-white"
                      : someSelected
                        ? "border-laser-violet bg-laser-violet/40 text-white"
                        : "border-lavender-mist bg-eclipse-black text-transparent hover:border-laser-violet"
                  )}
                  aria-label={allSelected ? "Deselect all" : "Select all"}
                >
                  <CheckIcon className="size-3 stroke-[3]" />
                </button>
              </TableHead>
            )}
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Name</TableHead>
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Size</TableHead>
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Uploaded</TableHead>
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Public</TableHead>
            <TableHead className="w-9" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => {
            const isSelected = selectedIds.has(file.id)
            const isShared = Boolean(file.sharedBy)
            const rowReadOnly = readOnly || isShared

            return (
              <TableRow
                key={file.id}
                draggable
                onDragStart={(e) => {
                  if (isShared) {
                    e.preventDefault()
                    return
                  }
                  e.dataTransfer.setData("application/silo-file-id", file.id)
                  e.dataTransfer.setData("text/plain", file.id)
                }}
                className={cn(
                  "border-b border-lavender-mist/40 transition-colors hover:bg-cream-canvas/60 animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-backwards",
                  isSelected && "bg-cream-canvas/80"
                )}
                style={{ animationDelay: `${Math.min(index, 10) * 30}ms`, animationDuration: "200ms" }}
              >
                {onToggleSelect && !isShared && (
                  <TableCell className="w-10 pl-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleSelect(file.id)
                      }}
                      className={cn(
                        "flex size-4.5 items-center justify-center rounded-md border transition-all cursor-pointer",
                        isSelected
                          ? "border-laser-violet bg-laser-violet text-white shadow-sm"
                          : "border-lavender-mist/80 bg-eclipse-black text-transparent hover:border-laser-violet"
                      )}
                      aria-label={isSelected ? "Deselect file" : "Select file"}
                    >
                      <CheckIcon className="size-3 stroke-[3]" />
                    </button>
                  </TableCell>
                )}
                <TableCell className="max-w-64">
                  <button
                    onClick={() => onPreview(file)}
                    className="group flex items-center gap-3 truncate text-left font-medium cursor-pointer"
                  >
                    <FileTypeBadge mimeType={file.mimeType} />
                    <span className="truncate text-ink-black group-hover:text-laser-violet transition-colors">
                      {file.originalName}
                    </span>
                  </button>
                </TableCell>
                <TableCell className="font-mono text-[12px] text-silver-smoke">{formatBytes(file.sizeBytes)}</TableCell>
                <TableCell className="font-mono text-[12px] text-ash-wisp">{formatDate(file.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {rowReadOnly ? (
                      file.visibility === "public" ? (
                        <Badge variant="secondary" className="rounded-full bg-laser-violet/20 border border-laser-violet/40 px-2 py-0.5 text-[10px] font-mono text-laser-violet">
                          Public
                        </Badge>
                      ) : (
                        <span className="font-mono text-[11px] text-ash-wisp">Private</span>
                      )
                    ) : (
                      <>
                        <Switch checked={file.visibility === "public"} onCheckedChange={() => onToggleVisibility(file)} />
                        {file.visibility === "public" && (
                          <Badge variant="secondary" className="rounded-full bg-laser-violet/20 border border-laser-violet/40 px-2 py-0.5 text-[10px] font-mono text-laser-violet">
                            Public
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
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
                    readOnly={rowReadOnly}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Mobile */}
      <div className="flex flex-col divide-y divide-lavender-mist/40 md:hidden">
        {files.map((file, index) => {
          const isSelected = selectedIds.has(file.id)
          const isShared = Boolean(file.sharedBy)
          const rowReadOnly = readOnly || isShared

          return (
            <div
              key={file.id}
              className={cn(
                "flex animate-in items-center gap-3 fade-in-0 slide-in-from-bottom-1 py-3.5 fill-mode-backwards",
                isSelected && "bg-cream-canvas/40 px-2 rounded-lg"
              )}
              style={{ animationDelay: `${Math.min(index, 10) * 30}ms`, animationDuration: "200ms" }}
            >
              {onToggleSelect && !isShared && (
                <button
                  type="button"
                  onClick={() => onToggleSelect(file.id)}
                  className={cn(
                    "flex size-4.5 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer",
                    isSelected
                      ? "border-laser-violet bg-laser-violet text-white"
                      : "border-lavender-mist/80 bg-eclipse-black text-transparent"
                  )}
                >
                  <CheckIcon className="size-3 stroke-[3]" />
                </button>
              )}
              <button onClick={() => onPreview(file)} className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer">
                <FileTypeBadge mimeType={file.mimeType} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-black">{file.originalName}</p>
                  <p className="font-mono text-[11px] text-ash-wisp">
                    {formatBytes(file.sizeBytes)} · {formatDate(file.createdAt)}
                    {file.visibility === "public" && " · Public"}
                  </p>
                </div>
              </button>
              {!rowReadOnly && <Switch checked={file.visibility === "public"} onCheckedChange={() => onToggleVisibility(file)} />}
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
                readOnly={rowReadOnly}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}
