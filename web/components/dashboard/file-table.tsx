"use client"

import { MoreHorizontalIcon, DownloadIcon, Trash2Icon, LinkIcon, PencilIcon, Share2Icon, InfoIcon, FolderInputIcon, StarIcon, StarOffIcon } from "lucide-react"
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

interface FileTableProps {
  files: FileRecord[]
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="text-silver-smoke hover:text-paper-white">
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="border-lavender-mist bg-eclipse-black text-paper-white">
        <DropdownMenuItem onClick={() => onDownload(file)} className="hover:bg-void-plum hover:text-laser-violet">
          <DownloadIcon data-icon="inline-start" />
          Download
        </DropdownMenuItem>
        {!readOnly && (
          <DropdownMenuItem onClick={() => onRename(file)} className="hover:bg-void-plum hover:text-laser-violet">
            <PencilIcon data-icon="inline-start" />
            Rename
          </DropdownMenuItem>
        )}
        {!readOnly && (
          <DropdownMenuItem onClick={() => onShare(file)} className="hover:bg-void-plum hover:text-laser-violet">
            <Share2Icon data-icon="inline-start" />
            Share
          </DropdownMenuItem>
        )}
        {!readOnly && (
          <DropdownMenuItem onClick={() => onMove(file)} className="hover:bg-void-plum hover:text-laser-violet">
            <FolderInputIcon data-icon="inline-start" />
            Move to folder
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onShowInfo(file)} className="hover:bg-void-plum hover:text-laser-violet">
          <InfoIcon data-icon="inline-start" />
          File information
        </DropdownMenuItem>
        {!readOnly && (
          <DropdownMenuItem onClick={() => onToggleStar(file)} className="hover:bg-void-plum hover:text-laser-violet">
            {file.starred ? <StarOffIcon data-icon="inline-start" /> : <StarIcon data-icon="inline-start" />}
            {file.starred ? "Remove from starred" : "Add to starred"}
          </DropdownMenuItem>
        )}
        {file.visibility === "public" && (
          <DropdownMenuItem onClick={() => onCopyLink(file)} className="hover:bg-void-plum hover:text-laser-violet">
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
  return (
    <>
      {/* Desktop */}
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow className="border-b border-lavender-mist hover:bg-transparent">
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Name</TableHead>
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Size</TableHead>
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Uploaded</TableHead>
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Public</TableHead>
            <TableHead className="w-9" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file, index) => (
            <TableRow
              key={file.id}
              className="border-b border-lavender-mist/40 transition-colors hover:bg-void-plum/60 animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-backwards"
              style={{ animationDelay: `${Math.min(index, 10) * 30}ms`, animationDuration: "200ms" }}
            >
              <TableCell className="max-w-64">
                <button
                  onClick={() => onPreview(file)}
                  className="group flex items-center gap-3 truncate text-left font-medium"
                >
                  <FileTypeBadge mimeType={file.mimeType} />
                  <span className="truncate text-paper-white group-hover:text-laser-violet transition-colors">{file.originalName}</span>
                </button>
              </TableCell>
              <TableCell className="font-mono text-[12px] text-silver-smoke">{formatBytes(file.sizeBytes)}</TableCell>
              <TableCell className="font-mono text-[12px] text-ash-wisp">{formatDate(file.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {readOnly ? (
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
                  readOnly={readOnly}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile */}
      <div className="flex flex-col divide-y divide-lavender-mist/40 md:hidden">
        {files.map((file, index) => (
          <div
            key={file.id}
            className="flex animate-in items-center gap-3 fade-in-0 slide-in-from-bottom-1 py-3.5 fill-mode-backwards"
            style={{ animationDelay: `${Math.min(index, 10) * 30}ms`, animationDuration: "200ms" }}
          >
            <button onClick={() => onPreview(file)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <FileTypeBadge mimeType={file.mimeType} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-paper-white">{file.originalName}</p>
                <p className="font-mono text-[11px] text-ash-wisp">
                  {formatBytes(file.sizeBytes)} · {formatDate(file.createdAt)}
                  {file.visibility === "public" && " · Public"}
                </p>
              </div>
            </button>
            {!readOnly && <Switch checked={file.visibility === "public"} onCheckedChange={() => onToggleVisibility(file)} />}
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
        ))}
      </div>
    </>
  )
}

