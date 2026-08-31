"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"

import {
  listTrash,
  restoreFile,
  restoreFolder,
  permanentlyDeleteFile,
  permanentlyDeleteFolder,
  emptyTrash,
  ApiError,
} from "@/lib/api"
import { DashboardTopbar } from "@/components/layout/dashboard-topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TrashTable, foldersToTrashItems, filesToTrashItems, type TrashItem } from "@/components/dashboard/trash-table"

export default function TrashPage() {
  const [items, setItems] = useState<TrashItem[] | null>(null)
  const [pendingDelete, setPendingDelete] = useState<TrashItem | null>(null)
  const [emptyConfirmOpen, setEmptyConfirmOpen] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const res = await listTrash()
      setItems([...foldersToTrashItems(res.folders), ...filesToTrashItems(res.files)])
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not load trash")
      setItems([])
    }
  }, [])

  useEffect(() => {
    let ignore = false

    listTrash()
      .then((res) => {
        if (!ignore) setItems([...foldersToTrashItems(res.folders), ...filesToTrashItems(res.files)])
      })
      .catch((err) => {
        if (ignore) return
        toast.error(err instanceof ApiError ? err.message : "Could not load trash")
        setItems([])
      })

    return () => {
      ignore = true
    }
  }, [])

  async function handleRestore(item: TrashItem) {
    setItems((prev) => prev?.filter((i) => !(i.type === item.type && i.id === item.id)) ?? null)

    try {
      if (item.type === "file") await restoreFile(item.id)
      else await restoreFolder(item.id)
      toast.success(`"${item.name}" restored`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not restore")
      refresh()
    }
  }

  async function confirmDeleteForever() {
    if (!pendingDelete) return
    const target = pendingDelete
    setPendingDelete(null)
    setItems((prev) => prev?.filter((i) => !(i.type === target.type && i.id === target.id)) ?? null)

    try {
      if (target.type === "file") await permanentlyDeleteFile(target.id)
      else await permanentlyDeleteFolder(target.id)
      toast.success(`"${target.name}" permanently deleted`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete")
      refresh()
    }
  }

  async function confirmEmptyTrash() {
    setEmptyConfirmOpen(false)
    setItems([])

    try {
      await emptyTrash()
      toast.success("Trash emptied")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not empty trash")
      refresh()
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="shrink-0 sticky top-0 z-10 bg-card">
        <DashboardTopbar title="Trash">
          {items && items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEmptyConfirmOpen(true)}
              className="border-lavender-mist bg-cream-canvas text-silver-smoke hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2Icon data-icon="inline-start" />
              Empty trash
            </Button>
          )}
        </DashboardTopbar>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 md:p-8">
        <Card className="border border-lavender-mist bg-eclipse-black text-ink-black">
          <CardContent className="flex flex-col gap-4 p-6">
            {items === null ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full bg-lavender-mist/40" />
                <Skeleton className="h-10 w-full bg-lavender-mist/40" />
                <Skeleton className="h-10 w-full bg-lavender-mist/40" />
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center font-mono text-sm text-ash-wisp">Trash is empty.</div>
            ) : (
              <TrashTable items={items} onRestore={handleRestore} onDeleteForever={setPendingDelete} />
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent className="border-lavender-mist bg-eclipse-black text-ink-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-ink-black">Delete &quot;{pendingDelete?.name}&quot; forever?</AlertDialogTitle>
            <AlertDialogDescription className="text-silver-smoke">
              {pendingDelete?.type === "folder"
                ? "This permanently deletes the folder and everything inside it. This cannot be undone."
                : "This permanently removes the file from storage. This cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-lavender-mist bg-cream-canvas text-ink-black hover:bg-lavender-mist/40">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteForever} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete forever</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={emptyConfirmOpen} onOpenChange={setEmptyConfirmOpen}>
        <AlertDialogContent className="border-lavender-mist bg-eclipse-black text-ink-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-ink-black">Empty trash?</AlertDialogTitle>
            <AlertDialogDescription className="text-silver-smoke">
              This permanently deletes everything in Trash. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-lavender-mist bg-cream-canvas text-ink-black hover:bg-lavender-mist/40">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEmptyTrash} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Empty trash</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

