"use client"

import { FolderIcon, RotateCcwIcon, Trash2Icon } from "lucide-react"
import type { FileRecord, FolderRecord } from "@/lib/api"
import { formatBytes, formatDate } from "@/lib/format"
import { FileTypeBadge } from "@/components/shared/file-icon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export interface TrashItem {
  type: "file" | "folder"
  id: string
  name: string
  deletedAt: string
  sizeBytes?: number
  mimeType?: string
}

export function foldersToTrashItems(folders: FolderRecord[]): TrashItem[] {
  return folders.map((f) => ({ type: "folder", id: f.id, name: f.name, deletedAt: f.deletedAt! }))
}

export function filesToTrashItems(files: FileRecord[]): TrashItem[] {
  return files.map((f) => ({
    type: "file",
    id: f.id,
    name: f.originalName,
    deletedAt: f.deletedAt!,
    sizeBytes: f.sizeBytes,
    mimeType: f.mimeType,
  }))
}

interface TrashTableProps {
  items: TrashItem[]
  onRestore: (item: TrashItem) => void
  onDeleteForever: (item: TrashItem) => void
}

export function TrashTable({ items, onRestore, onDeleteForever }: TrashTableProps) {
  return (
    <>
      {/* Desktop */}
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow className="border-b border-lavender-mist hover:bg-transparent">
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Name</TableHead>
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Size</TableHead>
            <TableHead className="font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp">Trashed</TableHead>
            <TableHead className="w-32" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={`${item.type}-${item.id}`} className="border-b border-lavender-mist/40 transition-colors hover:bg-void-plum/60">
              <TableCell className="max-w-64">
                <div className="flex items-center gap-3 truncate font-medium">
                  {item.type === "folder" ? (
                    <FolderIcon className="size-8 shrink-0 text-laser-violet" strokeWidth={1.5} />
                  ) : (
                    <FileTypeBadge mimeType={item.mimeType ?? ""} />
                  )}
                  <span className="truncate text-paper-white">{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-[12px] text-silver-smoke">{item.sizeBytes !== undefined ? formatBytes(item.sizeBytes) : "—"}</TableCell>
              <TableCell className="font-mono text-[12px] text-ash-wisp">{formatDate(item.deletedAt)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => onRestore(item)} aria-label="Restore" className="text-silver-smoke hover:text-laser-violet">
                    <RotateCcwIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDeleteForever(item)}
                    aria-label="Delete forever"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Mobile */}
      <div className="flex flex-col divide-y divide-lavender-mist/40 md:hidden">
        {items.map((item) => (
          <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 py-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {item.type === "folder" ? (
                <FolderIcon className="size-8 shrink-0 text-laser-violet" strokeWidth={1.5} />
              ) : (
                <FileTypeBadge mimeType={item.mimeType ?? ""} />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-paper-white">{item.name}</p>
                <p className="font-mono text-[11px] text-ash-wisp">
                  {item.sizeBytes !== undefined && `${formatBytes(item.sizeBytes)} · `}
                  trashed {formatDate(item.deletedAt)}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => onRestore(item)} aria-label="Restore" className="text-silver-smoke hover:text-laser-violet">
              <RotateCcwIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDeleteForever(item)}
              aria-label="Delete forever"
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}

