"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  deleteFile,
  listFiles,
  listFolder,
  listStarred,
  listSharedWithMe,
  renameFolder,
  renameFile,
  moveFile,
  starFile,
  starFolder,
  trashFolder,
  restoreFile,
  restoreFolder,
  setVisibility,
  type FileRecord,
  type FolderRecord,
  type FolderContents,
  ApiError,
} from "@/lib/api"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { FolderIcon, ListIcon, LayoutGridIcon } from "lucide-react"

import { FileSortMenu, type SortKey, type SortDirection } from "@/components/dashboard/file-toolbar"
import { FileTable } from "@/components/dashboard/file-table"
import { FileGrid } from "@/components/dashboard/file-grid"
import { FilePreviewDialog } from "@/components/dashboard/file-preview-dialog"
import { FolderGrid } from "@/components/dashboard/folder-grid"
import { FolderBreadcrumb } from "@/components/dashboard/folder-breadcrumb"
import { FolderNameDialog } from "@/components/dashboard/folder-name-dialog"
import { ShareDialog } from "@/components/dashboard/share-dialog"
import { FileInfoDialog } from "@/components/dashboard/file-info-dialog"
import { MoveFileDialog } from "@/components/dashboard/move-file-dialog"
import { useDrive, useFolderSync } from "@/components/layout/drive-context"

const VIEW_MODE_KEY = "silo-view-mode"

type Mode = { type: "recent" } | { type: "starred" } | { type: "shared" } | { type: "folder"; folderId: string }

async function fetchModeContents(mode: Mode, query: string): Promise<FolderContents> {
  const q = query.trim()
  if (q) {
    // A search spans every folder, so it ignores the current mode entirely.
    const res = await listFiles({ q })
    return { folder: null, parents: [], folders: [], files: res.items }
  }
  if (mode.type === "recent") {
    const res = await listFiles()
    return { folder: null, parents: [], folders: [], files: res.items }
  }
  if (mode.type === "starred") {
    const res = await listStarred()
    return { folder: null, parents: [], folders: res.folders, files: res.files }
  }
  if (mode.type === "shared") {
    const res = await listSharedWithMe()
    return { folder: null, parents: [], folders: [], files: res.files }
  }
  return listFolder(mode.folderId)
}

const SECTION_LABEL = "font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp"

export function FileManager({ query, mode }: { query: string; mode: Mode }) {
  const drive = useDrive()
  const [files, setFiles] = useState<FileRecord[] | null>(null)
  const [folders, setFolders] = useState<FolderRecord[]>([])
  const [currentFolder, setCurrentFolder] = useState<FolderRecord | null>(null)
  const [parents, setParents] = useState<FolderRecord[]>([])
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [renameTarget, setRenameTarget] = useState<FolderRecord | null>(null)
  const [viewMode, setViewModeState] = useState<"list" | "grid">(
    () => (typeof window !== "undefined" && localStorage.getItem(VIEW_MODE_KEY) === "list" ? "list" : "grid"),
  )
  const [renameFileTarget, setRenameFileTarget] = useState<FileRecord | null>(null)
  const [shareTarget, setShareTarget] = useState<FileRecord | null>(null)
  const [infoTarget, setInfoTarget] = useState<FileRecord | null>(null)
  const [moveTarget, setMoveTarget] = useState<FileRecord | null>(null)

  function setViewMode(next: "list" | "grid") {
    setViewModeState(next)
    localStorage.setItem(VIEW_MODE_KEY, next)
  }

  const isFolderMode = mode.type === "folder"
  const showFolders = isFolderMode || mode.type === "starred"
  const readOnly = mode.type === "shared"
  const folderId = mode.type === "folder" ? mode.folderId : undefined

  const refresh = useCallback(async () => {
    try {
      const res = await fetchModeContents(mode, query)
      setCurrentFolder(res.folder)
      setParents(res.parents)
      setFolders(res.folders)
      setFiles(res.files)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not load your files")
      setFiles([])
    }
  }, [mode, query])

  useFolderSync(folderId ?? null, refresh)

  useEffect(() => {
    let ignore = false
    fetchModeContents(mode, query)
      .then((res) => {
        if (ignore) return
        setCurrentFolder(res.folder)
        setParents(res.parents)
        setFolders(res.folders)
        setFiles(res.files)
      })
      .catch((err) => {
        if (ignore) return
        toast.error(err instanceof ApiError ? err.message : "Could not load your files")
        setFiles([])
      })

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode.type, mode.type === "folder" ? mode.folderId : null, query])

  async function handleToggleVisibility(file: FileRecord) {
    const next = file.visibility === "public" ? "private" : "public"
    setFiles((prev) => prev?.map((f) => (f.id === file.id ? { ...f, visibility: next } : f)) ?? null)

    try {
      await setVisibility(file.id, next)
      toast.success(next === "public" ? "File is now public" : "File is now private")
    } catch (err) {
      setFiles((prev) => prev?.map((f) => (f.id === file.id ? { ...f, visibility: file.visibility } : f)) ?? null)
      toast.error(err instanceof ApiError ? err.message : "Could not update visibility")
    }
  }

  function handleCopyLink(file: FileRecord) {
    const url = `${window.location.origin}/s/${file.shareSlug}`
    navigator.clipboard.writeText(url)
    toast.success("Share link copied")
  }

  async function handleRenameFile(name: string) {
    if (!renameFileTarget) return
    try {
      await renameFile(renameFileTarget.id, name)
      refresh()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not rename file")
    }
  }

  async function handleMoveFile(file: FileRecord, targetFolderId: string | null) {
    try {
      await moveFile(file.id, targetFolderId)
      toast.success(`"${file.originalName}" moved`)
      refresh()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not move file")
    }
  }

  async function handleToggleStarFile(file: FileRecord) {
    const next = !file.starred
    setFiles((prev) => (mode.type === "starred" && !next ? prev?.filter((f) => f.id !== file.id) ?? null : prev?.map((f) => (f.id === file.id ? { ...f, starred: next } : f)) ?? null))

    try {
      await starFile(file.id, next)
      toast.success(next ? "Added to starred" : "Removed from starred")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update starred")
      refresh()
    }
  }

  async function handleToggleStarFolder(folder: FolderRecord) {
    const next = !folder.starred
    setFolders((prev) => (mode.type === "starred" && !next ? prev.filter((f) => f.id !== folder.id) : prev.map((f) => (f.id === folder.id ? { ...f, starred: next } : f))))

    try {
      await starFolder(folder.id, next)
      toast.success(next ? "Added to starred" : "Removed from starred")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update starred")
      refresh()
    }
  }

  async function handleTrashFile(file: FileRecord) {
    setFiles((prev) => prev?.filter((f) => f.id !== file.id) ?? null)

    try {
      await deleteFile(file.id)
      toast(`"${file.originalName}" moved to trash`, {
        action: {
          label: "Undo",
          onClick: async () => {
            await restoreFile(file.id)
            refresh()
          },
        },
      })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not move file to trash")
      refresh()
    }
  }

  async function handleTrashFolder(folder: FolderRecord) {
    setFolders((prev) => prev.filter((f) => f.id !== folder.id))

    try {
      await trashFolder(folder.id)
      toast(`"${folder.name}" moved to trash`, {
        action: {
          label: "Undo",
          onClick: async () => {
            await restoreFolder(folder.id)
            refresh()
          },
        },
      })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not move folder to trash")
      refresh()
    }
  }

  async function handleRenameFolder(name: string) {
    if (!renameTarget) return
    try {
      await renameFolder(renameTarget.id, name)
      refresh()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not rename folder")
    }
  }

  const visibleFiles = useMemo(() => {
    if (!files) return []

    const filtered = query.trim()
      ? files.filter((f) => f.originalName.toLowerCase().includes(query.trim().toLowerCase()))
      : files

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortKey === "name") cmp = a.originalName.localeCompare(b.originalName)
      else if (sortKey === "size") cmp = a.sizeBytes - b.sizeBytes
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDirection === "asc" ? cmp : -cmp
    })

    return sorted
  }, [files, query, sortKey, sortDirection])

  const searching = query.trim().length > 0
  const isEmpty = files !== null && files.length === 0 && folders.length === 0
  const isRootHero = !searching && isFolderMode && mode.folderId === "root" && parents.length === 0 && isEmpty

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-4 md:p-8">
      {isFolderMode && <FolderBreadcrumb parents={parents} current={currentFolder} />}

      {showFolders && folders.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className={SECTION_LABEL}>Folders</span>
          <FolderGrid folders={folders} onRename={setRenameTarget} onTrash={handleTrashFolder} onToggleStar={handleToggleStarFolder} />
        </div>
      )}

      <Card className="border border-lavender-mist bg-eclipse-black text-paper-white shadow-[0_0_0_1px_rgba(68,55,74,0.6)]">
        <CardContent className="flex flex-col gap-4 p-6">
          {files === null ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-full bg-lavender-mist/40" />
              <Skeleton className="h-10 w-full bg-lavender-mist/40" />
              <Skeleton className="h-10 w-full bg-lavender-mist/40" />
              <Skeleton className="h-10 w-full bg-lavender-mist/40" />
            </div>
          ) : isEmpty ? (
            isRootHero ? (
              <div className="animate-fade-in-scale flex flex-col items-center gap-4 py-16 text-center">
                <div className="glow-ambient flex size-16 items-center justify-center rounded-full border border-lavender-mist bg-void-plum text-laser-violet">
                  <FolderIcon className="size-7" />
                </div>
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-paper-white">Welcome to Silo</h2>
                <p className="max-w-sm font-mono text-[11px] text-ash-wisp">
                  Use the New button in the sidebar to upload files or create a folder.
                </p>
              </div>
            ) : (
              <div className="py-12 text-center font-mono text-sm text-ash-wisp">
                {searching
                  ? `No files match "${query}".`
                  : mode.type === "recent"
                    ? "No files uploaded yet."
                    : mode.type === "starred"
                      ? "Nothing starred yet."
                      : mode.type === "shared"
                        ? "Nothing shared with you yet."
                        : "Nothing here yet. Use the New button in the sidebar."}
              </div>
            )
          ) : files.length === 0 ? (
            <div className="py-12 text-center font-mono text-sm text-ash-wisp">No files in this folder yet.</div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className={SECTION_LABEL}>Files</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 rounded-lg border border-lavender-mist p-0.5">
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon-sm"
                      aria-label="List view"
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "bg-void-plum text-paper-white" : "text-silver-smoke hover:text-paper-white"}
                    >
                      <ListIcon />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon-sm"
                      aria-label="Grid view"
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "bg-void-plum text-paper-white" : "text-silver-smoke hover:text-paper-white"}
                    >
                      <LayoutGridIcon />
                    </Button>
                  </div>
                  <FileSortMenu
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={(key, direction) => {
                      setSortKey(key)
                      setSortDirection(direction)
                    }}
                  />
                </div>
              </div>
              {visibleFiles.length === 0 ? (
                <div className="py-12 text-center font-mono text-sm text-ash-wisp">
                  No files match &quot;{query}&quot;.
                </div>
              ) : viewMode === "grid" ? (
                <FileGrid
                  files={visibleFiles}
                  onPreview={setPreviewFile}
                  onDownload={(file) => drive.downloadFile(file)}
                  onCopyLink={handleCopyLink}
                  onDelete={handleTrashFile}
                  onRename={setRenameFileTarget}
                  onShare={setShareTarget}
                  onShowInfo={setInfoTarget}
                  onMove={setMoveTarget}
                  onToggleStar={handleToggleStarFile}
                  readOnly={readOnly}
                />
              ) : (
                <FileTable
                  files={visibleFiles}
                  onPreview={setPreviewFile}
                  onToggleVisibility={handleToggleVisibility}
                  onDownload={(file) => drive.downloadFile(file)}
                  onCopyLink={handleCopyLink}
                  onDelete={handleTrashFile}
                  onRename={setRenameFileTarget}
                  onShare={setShareTarget}
                  onShowInfo={setInfoTarget}
                  onMove={setMoveTarget}
                  onToggleStar={handleToggleStarFile}
                  readOnly={readOnly}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <FilePreviewDialog file={previewFile} onOpenChange={(open) => !open && setPreviewFile(null)} />

      <FolderNameDialog
        open={renameTarget !== null}
        onOpenChange={(open) => !open && setRenameTarget(null)}
        title="Rename folder"
        initialName={renameTarget?.name}
        submitLabel="Save"
        onSubmit={handleRenameFolder}
      />

      <FolderNameDialog
        open={renameFileTarget !== null}
        onOpenChange={(open) => !open && setRenameFileTarget(null)}
        title="Rename file"
        initialName={renameFileTarget?.originalName}
        submitLabel="Save"
        onSubmit={handleRenameFile}
      />

      <ShareDialog
        file={shareTarget}
        onOpenChange={(open) => !open && setShareTarget(null)}
        onToggleVisibility={(file) => {
          handleToggleVisibility(file)
          setShareTarget((prev) => (prev ? { ...prev, visibility: prev.visibility === "public" ? "private" : "public" } : prev))
        }}
        onCopyLink={handleCopyLink}
      />

      <FileInfoDialog file={infoTarget} onOpenChange={(open) => !open && setInfoTarget(null)} />

      <MoveFileDialog file={moveTarget} onOpenChange={(open) => !open && setMoveTarget(null)} onMove={handleMoveFile} />
    </div>
  )
}
