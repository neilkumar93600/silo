"use client"

import { useEffect, useState } from "react"
import { LinkIcon, XIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { listFileShares, addFileShare, removeFileShare, ApiError, type FileRecord, type ShareRecipient } from "@/lib/api"
import { initialsOf } from "@/lib/format"

function SharePanel({
  file,
  onToggleVisibility,
  onCopyLink,
}: {
  file: FileRecord
  onToggleVisibility: (file: FileRecord) => void
  onCopyLink: (file: FileRecord) => void
}) {
  const [recipients, setRecipients] = useState<ShareRecipient[] | null>(null)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listFileShares(file.id)
      .then(setRecipients)
      .catch(() => setRecipients([]))
  }, [file.id])

  async function handleAdd() {
    const trimmed = email.trim()
    if (!trimmed) return
    setSubmitting(true)
    setError(null)
    try {
      const updated = await addFileShare(file.id, trimmed)
      setRecipients(updated)
      setEmail("")
      toast.success(`Shared with ${trimmed}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not share file")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemove(userId: string) {
    const updated = await removeFileShare(file.id, userId)
    setRecipients(updated)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="truncate text-paper-white">Share &quot;{file.originalName}&quot;</DialogTitle>
        <DialogDescription className="text-silver-smoke">
          Anyone with the link can view a public file. People added below can view and download it directly.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-lavender-mist/60 bg-void-plum/60 px-4 py-3">
        <div className="flex min-w-0 flex-col">
          <span className="text-sm font-medium text-paper-white">Public link</span>
          <span className="truncate font-mono text-[11px] text-ash-wisp">
            {file.visibility === "public" ? "Anyone with the link can view" : "Only you can access this file"}
          </span>
        </div>
        <Switch checked={file.visibility === "public"} onCheckedChange={() => onToggleVisibility(file)} />
      </div>

      <Button
        disabled={file.visibility !== "public"}
        onClick={() => onCopyLink(file)}
        className="w-full bg-primary text-primary-foreground font-medium hover:bg-primary/90"
      >
        <LinkIcon data-icon="inline-start" />
        Copy link
      </Button>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-paper-white">Share with a person</span>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="person@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="border-lavender-mist bg-void-plum text-paper-white placeholder:text-ash-wisp focus-visible:ring-laser-violet"
          />
          <Button
            disabled={submitting || !email.trim()}
            onClick={handleAdd}
            variant="secondary"
            className="shrink-0 bg-void-plum text-paper-white hover:bg-void-plum/80"
          >
            Add
          </Button>
        </div>
        {error && <p className="font-mono text-[11px] text-destructive">{error}</p>}
      </div>

      {recipients === null ? (
        <p className="font-mono text-[11px] text-ash-wisp">Loading…</p>
      ) : (
        recipients.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {recipients.map((r) => (
              <div key={r.userId} className="flex items-center gap-3 rounded-lg border border-lavender-mist/60 px-3 py-2">
                <Avatar className="size-7 shrink-0 border border-lavender-mist">
                  <AvatarFallback className="bg-carbon-ink text-[10px] font-mono font-medium text-laser-violet">
                    {initialsOf(r.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-xs font-medium text-paper-white">{r.name}</span>
                  <span className="truncate font-mono text-[10px] text-ash-wisp">{r.email}</span>
                </div>
                <button
                  type="button"
                  aria-label="Remove access"
                  onClick={() => handleRemove(r.userId)}
                  className="shrink-0 text-ash-wisp hover:text-paper-white"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </>
  )
}

export function ShareDialog({
  file,
  onOpenChange,
  onToggleVisibility,
  onCopyLink,
}: {
  file: FileRecord | null
  onOpenChange: (open: boolean) => void
  onToggleVisibility: (file: FileRecord) => void
  onCopyLink: (file: FileRecord) => void
}) {
  return (
    <Dialog open={file !== null} onOpenChange={onOpenChange}>
      <DialogContent className="border-lavender-mist bg-eclipse-black text-paper-white">
        {file && <SharePanel key={file.id} file={file} onToggleVisibility={onToggleVisibility} onCopyLink={onCopyLink} />}
      </DialogContent>
    </Dialog>
  )
}
