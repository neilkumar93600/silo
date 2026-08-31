"use client"

import { useEffect, useState } from "react"
import { ChevronRightIcon, FolderIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { listFolder, type FolderRecord, type FileRecord } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function PickerRow({
  folder,
  depth,
  selectedId,
  onSelect,
}: {
  folder: FolderRecord
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [children, setChildren] = useState<FolderRecord[] | null>(null)
  const [loading, setLoading] = useState(false)
  const selected = selectedId === folder.id

  function toggle(e: React.MouseEvent) {
    e.stopPropagation()
    const next = !expanded
    setExpanded(next)
    if (next && children === null) {
      setLoading(true)
      listFolder(folder.id)
        .then((res) => setChildren(res.folders))
        .catch(() => setChildren([]))
        .finally(() => setLoading(false))
    }
  }

  return (
    <div>
      <div
        onClick={() => onSelect(folder.id)}
        className={cn(
          "flex h-9 cursor-pointer items-center gap-1 rounded-lg pr-3 text-sm transition-colors",
          selected ? "bg-cream-canvas text-laser-violet" : "text-silver-smoke hover:bg-cream-canvas/60 hover:text-ink-black",
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        <button type="button" onClick={toggle} className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-cream-canvas">
          <ChevronRightIcon className={cn("size-3.5 transition-transform", expanded && "rotate-90")} />
        </button>
        <FolderIcon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate">{folder.name}</span>
        {selected && <CheckIcon className="size-4 shrink-0 text-laser-violet" />}
      </div>
      {expanded && (
        <div>
          {loading && (
            <div className="py-1 text-xs text-ash-wisp" style={{ paddingLeft: 8 + (depth + 1) * 16 }}>
              Loading…
            </div>
          )}
          {children?.map((child) => (
            <PickerRow key={child.id} folder={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

function MovePicker({
  file,
  onOpenChange,
  onMove,
}: {
  file: FileRecord
  onOpenChange: (open: boolean) => void
  onMove: (file: FileRecord, folderId: string | null) => Promise<void> | void
}) {
  const [selectedId, setSelectedId] = useState<string | null>("root")
  const [rootChildren, setRootChildren] = useState<FolderRecord[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listFolder("root")
      .then((res) => setRootChildren(res.folders))
      .catch(() => setRootChildren([]))
      .finally(() => setLoading(false))
  }, [])

  async function confirm() {
    setSubmitting(true)
    try {
      await onMove(file, selectedId === "root" ? null : selectedId)
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="truncate text-ink-black">Move &quot;{file.originalName}&quot;</DialogTitle>
      </DialogHeader>
      <div className="max-h-64 overflow-y-auto rounded-xl border border-lavender-mist/60 p-1">
        <div
          onClick={() => setSelectedId("root")}
          className={cn(
            "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm transition-colors",
            selectedId === "root" ? "bg-cream-canvas text-laser-violet" : "text-silver-smoke hover:bg-cream-canvas/60 hover:text-ink-black",
          )}
        >
          <FolderIcon className="size-4 shrink-0" />
          <span className="flex-1">My Drive</span>
          {selectedId === "root" && <CheckIcon className="size-4 shrink-0 text-laser-violet" />}
        </div>
        {loading && <div className="px-2 py-1 text-xs text-ash-wisp">Loading…</div>}
        {rootChildren?.map((folder) => (
          <PickerRow key={folder.id} folder={folder} depth={1} selectedId={selectedId} onSelect={setSelectedId} />
        ))}
      </div>
      <DialogFooter>
        <Button
          disabled={submitting}
          onClick={confirm}
          className="bg-primary text-primary-foreground font-medium hover:bg-primary/90"
        >
          Move here
        </Button>
      </DialogFooter>
    </>
  )
}

export function MoveFileDialog({
  file,
  onOpenChange,
  onMove,
}: {
  file: FileRecord | null
  onOpenChange: (open: boolean) => void
  onMove: (file: FileRecord, folderId: string | null) => Promise<void> | void
}) {
  return (
    <Dialog open={file !== null} onOpenChange={onOpenChange}>
      <DialogContent className="border-lavender-mist bg-eclipse-black text-ink-black">
        {file && <MovePicker key={file.id} file={file} onOpenChange={onOpenChange} onMove={onMove} />}
      </DialogContent>
    </Dialog>
  )
}
