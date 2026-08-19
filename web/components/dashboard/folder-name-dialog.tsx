"use client"

import { useId, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FolderNameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  initialName?: string
  submitLabel: string
  onSubmit: (name: string) => void | Promise<void>
}

function FolderNameForm({
  initialName,
  title,
  description,
  submitLabel,
  onSubmit,
  onOpenChange,
}: Omit<FolderNameDialogProps, "open">) {
  const inputId = useId()
  const [name, setName] = useState(initialName ?? "")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      await onSubmit(trimmed)
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="text-paper-white">{title}</DialogTitle>
        {description && <DialogDescription className="text-silver-smoke">{description}</DialogDescription>}
      </DialogHeader>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId} className="text-silver-smoke text-xs font-medium">Name</Label>
        <Input
          id={inputId}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={255}
          className="border-lavender-mist bg-void-plum text-paper-white focus-visible:ring-laser-violet"
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={submitting || name.trim().length === 0} className="bg-primary text-primary-foreground font-medium hover:bg-primary/90">
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function FolderNameDialog({ open, onOpenChange, ...formProps }: FolderNameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-lavender-mist bg-eclipse-black text-paper-white">
        <FolderNameForm key={open ? "open" : "closed"} onOpenChange={onOpenChange} {...formProps} />
      </DialogContent>
    </Dialog>
  )
}

