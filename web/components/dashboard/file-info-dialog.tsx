"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileTypeIcon } from "@/components/shared/file-icon"
import { formatBytes, formatDate } from "@/lib/format"
import type { FileRecord } from "@/lib/api"

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-lavender-mist/40 py-2 text-sm last:border-0">
      <span className="text-ash-wisp">{label}</span>
      <span className="max-w-[60%] truncate text-right font-medium text-paper-white">{value}</span>
    </div>
  )
}

export function FileInfoDialog({ file, onOpenChange }: { file: FileRecord | null; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={file !== null} onOpenChange={onOpenChange}>
      <DialogContent className="border-lavender-mist bg-eclipse-black text-paper-white">
        {file && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <FileTypeIcon mimeType={file.mimeType} className="size-8 shrink-0 text-laser-violet" />
                <DialogTitle className="truncate text-paper-white">{file.originalName}</DialogTitle>
              </div>
            </DialogHeader>
            <div className="flex flex-col">
              <Row label="Type" value={file.mimeType} />
              <Row label="Size" value={formatBytes(file.sizeBytes)} />
              <Row label="Uploaded" value={formatDate(file.createdAt)} />
              <Row label="Visibility" value={file.visibility === "public" ? "Public" : "Private"} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
