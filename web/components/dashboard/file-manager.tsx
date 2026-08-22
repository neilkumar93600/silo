"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { FolderIcon, LayoutGridIcon, ListIcon } from "lucide-react"

import {
  listFiles,
  listFolder,
  listHomeFeed,
  listSharedWithMe,
  listStarred,
  moveFile,
  renameFile,
  renameFolder,
  restoreFile,
  restoreFolder,
  starFile,
  starFolder,
  deleteFile,
  trashFolder,
  setVisibility,
  readFileCache,
  writeFileCache,
  type FileRecord,
  type FolderRecord,
  ApiError,
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDrive, useFolderSync } from "@/components/layout/drive-context"
import { FolderBreadcrumb } from "@/components/dashboard/folder-breadcrumb"
import { FolderGrid, FolderGlyph } from "@/components/dashboard/folder-grid"
import { FileGrid } from "@/components/dashboard/file-grid"
import { FileTable } from "@/components/dashboard/file-table"
import { FilePreviewDialog } from "@/components/dashboard/file-preview-dialog"
import { FolderNameDialog } from "@/components/dashboard/folder-name-dialog"
import { ShareDialog } from "@/components/dashboard/share-dialog"
import { FileInfoDialog } from "@/components/dashboard/file-info-dialog"
import { MoveFileDialog } from "@/components/dashboard/move-file-dialog"
import { FileSortMenu, type SortDirection, type SortKey } from "@/components/dashboard/file-toolbar"
import { BulkActionBar } from "@/components/dashboard/bulk-action-bar"

type ViewMode = "list" | "grid"

type FileManagerProps = {
  query?: string
  mode?:
    | { type: "folder"; folderId: string }
    | { type: "starred" }
    | { type: "recent" }
    | { type: "shared" }
    | { type: "home" }
}

const SECTION_LABEL = "font-mono text-[11px] tracking-[0.05em] uppercase text-ash-wisp select-none"

type CachedListing = {
  files: FileRecord[]
  folders: FolderRecord[]
  parents?: FolderRecord[]
  currentFolder?: FolderRecord | null
}

function cacheKeyForMode(mode: FileManagerProps["mode"]) {
  if (!mode || mode.type === "folder") return `folder:${mode?.folderId ?? "root"}`
  return mode.type
}

export function FileManager({ query = "", mode = { type: "folder", folderId: "root" } }: FileManagerProps) {
  const isFolderMode = mode.type === "folder"
  const isHomeMode = mode.type === "home"
  // Home must register "root" as its active folder — not null — so the
  // sidebar's New/Upload button (which hides itself when activeFolderId
  // is null) keeps working from Home exactly like it does today.
  const currentFolderId = isFolderMode ? mode.folderId : isHomeMode ? "root" : null
  const showFolders = isFolderMode || isHomeMode

  const cacheKey = cacheKeyForMode(mode)

  // Initial state must match the server-rendered (cache-less) HTML exactly,
  // so the cached listing is seeded in a layout effect below rather than
  // read here during render — reading sessionStorage during the initial
  // client render would diverge from SSR output and fail hydration.
  const [files, setFiles] = useState<FileRecord[] | null>(null)
  const [folders, setFolders] = useState<FolderRecord[]>([])
  const [parents, setParents] = useState<FolderRecord[]>([])
  const [currentFolder, setCurrentFolder] = useState<FolderRecord | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  // Spacebar QuickLook - track last focused/hovered file for spacebar preview
  const [focusedFileId, setFocusedFileId] = useState<string | null>(null)

  // Dialog targets
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null)
  const [renameTarget, setRenameTarget] = useState<FolderRecord | null>(null)
  const [renameFileTarget, setRenameFileTarget] = useState<FileRecord | null>(null)
  const [shareTarget, setShareTarget] = useState<FileRecord | null>(null)
  const [infoTarget, setInfoTarget] = useState<FileRecord | null>(null)
  const [moveTarget, setMoveTarget] = useState<FileRecord | null>(null)

  const drive = useDrive()

  const refresh = useCallback(() => {
    const key = cacheKeyForMode(mode)
    if (mode.type === "folder") {
      listFolder(mode.folderId)
        .then((res) => {
          setFiles(res.files)
          setFolders(res.folders)
          setParents(res.parents ?? [])
          setCurrentFolder(res.folder ?? null)
          writeFileCache(key, { files: res.files, folders: res.folders, parents: res.parents ?? [], currentFolder: res.folder ?? null } satisfies CachedListing)
        })
        .catch((err) => toast.error(err instanceof ApiError ? err.message : "Failed to load files"))
    } else if (mode.type === "starred") {
      listStarred()
        .then((res) => {
          setFiles(res.files)
          setFolders(res.folders)
          writeFileCache(key, { files: res.files, folders: res.folders } satisfies CachedListing)
        })
        .catch((err) => toast.error(err instanceof ApiError ? err.message : "Failed to load starred items"))
    } else if (mode.type === "recent") {
      listFiles()
        .then((res) => {
          setFiles(res.items)
          setFolders([])
          writeFileCache(key, { files: res.items, folders: [] } satisfies CachedListing)
        })
        .catch((err) => toast.error(err instanceof ApiError ? err.message : "Failed to load recent files"))
    } else if (mode.type === "shared") {
      listSharedWithMe()
        .then((res) => {
          setFiles(res.files)
          setFolders([])
          writeFileCache(key, { files: res.files, folders: [] } satisfies CachedListing)
        })
        .catch((err) => toast.error(err instanceof ApiError ? err.message : "Failed to load shared files"))
    } else if (mode.type === "home") {
      Promise.all([listFolder("root"), listHomeFeed()])
        .then(([folderRes, homeRes]) => {
          setFiles(homeRes.files)
          setFolders(folderRes.folders)
          writeFileCache(key, { files: homeRes.files, folders: folderRes.folders } satisfies CachedListing)
        })
        .catch((err) => toast.error(err instanceof ApiError ? err.message : "Failed to load files"))
    }
  }, [mode])

  useFolderSync(currentFolderId, refresh)

  // Runs after hydration commits but before the browser paints, so the
  // cache-seeded content replaces the server's empty state with no visible
  // flash. Reading sessionStorage is a genuine external-system sync, not
  // state derivable from props — the lint rule's effect-vs-render guidance
  // doesn't apply here.
  useLayoutEffect(() => {
    const cached = readFileCache<CachedListing>(cacheKey)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiles(cached?.files ?? null)
    setFolders(cached?.folders ?? [])
    setParents(cached?.parents ?? [])
    setCurrentFolder(cached?.currentFolder ?? null)
  }, [cacheKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  const readOnly = mode.type === "shared"

  // Multi-select handlers
  const handleToggleSelect = useCallback((fileId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(fileId)) {
        next.delete(fileId)
      } else {
        next.add(fileId)
      }
      return next
    })
  }, [])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const visibleFolders = useMemo(() => {
    if (!folders) return []
    const q = query.trim().toLowerCase()
    if (!q) return folders
    return folders.filter((f) => f.name.toLowerCase().includes(q))
  }, [folders, query])

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

  const selectedFiles = useMemo(() => {
    if (!files || selectedIds.size === 0) return []
    return files.filter((f) => selectedIds.has(f.id))
  }, [files, selectedIds])

  const handleToggleSelectAll = useCallback(() => {
    const selectable = visibleFiles.filter((f) => !f.sharedBy)
    if (!selectable.length) return
    const allSelected = selectable.every((f) => selectedIds.has(f.id))
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(selectable.map((f) => f.id)))
    }
  }, [visibleFiles, selectedIds])

  // Keyboard shortcuts: Escape to clear selection, Cmd+A to select all, Space for QuickLook
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(tag)

      // Spacebar QuickLook preview (like macOS Finder)
      if (e.key === " " && !isInput && focusedFileId) {
        e.preventDefault()
        const file = visibleFiles.find((f) => f.id === focusedFileId)
        if (file) {
          setPreviewFile((prev) => (prev?.id === file.id ? null : file))
        }
      } else if (e.key === "Escape") {
        if (previewFile) {
          setPreviewFile(null)
        } else if (selectedIds.size > 0) {
          setSelectedIds(new Set())
        }
      } else if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "a" &&
        !isInput
      ) {
        e.preventDefault()
        const selectableFiles = visibleFiles.filter((f) => !f.sharedBy)
        if (selectableFiles.length > 0) {
          setSelectedIds(new Set(selectableFiles.map((f) => f.id)))
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIds, visibleFiles, focusedFileId, previewFile])

  // Bulk action handlers
  async function handleBulkDownload() {
    for (const file of selectedFiles) {
      drive.downloadFile(file)
    }
    toast.success(`Downloading ${selectedFiles.length} files`)
  }

  async function handleBulkToggleStar() {
    const allStarred = selectedFiles.every((f) => f.starred)
    const next = !allStarred

    setFiles((prev) =>
      prev?.map((f) => (selectedIds.has(f.id) ? { ...f, starred: next } : f)) ?? null
    )

    try {
      await Promise.all(selectedFiles.map((f) => starFile(f.id, next)))
      toast.success(next ? "Starred selected files" : "Unstarred selected files")
    } catch {
      toast.error("Could not update all files")
      refresh()
    }
  }

  async function handleBulkTrash() {
    const targets = [...selectedFiles]
    const ids = new Set(targets.map((f) => f.id))
    setFiles((prev) => prev?.filter((f) => !ids.has(f.id)) ?? null)
    setSelectedIds(new Set())

    try {
      await Promise.all(targets.map((f) => deleteFile(f.id)))
      toast(`Moved ${targets.length} files to trash`, {
        action: {
          label: "Undo",
          onClick: async () => {
            await Promise.all(targets.map((f) => restoreFile(f.id)))
            refresh()
          },
        },
      })
    } catch {
      toast.error("Could not move all files to trash")
      refresh()
    }
  }

  function handleBulkMove() {
    if (selectedFiles.length > 0) {
      setMoveTarget(selectedFiles[0])
    }
  }

  // Drag and drop file to folder
  async function handleDropFileToFolder(fileId: string, targetFolderId: string) {
    try {
      await moveFile(fileId, targetFolderId)
      const movedFile = files?.find((f) => f.id === fileId)
      toast.success(`"${movedFile?.originalName ?? "File"}" moved into folder`)
      refresh()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not move file into folder")
    }
  }

  async function handleCopyLink(file: FileRecord) {
    try {
      const url = `${window.location.origin}/s/${file.shareSlug}`
      await navigator.clipboard.writeText(url)
      toast.success("Share link copied to clipboard")
    } catch {
      toast.error("Could not copy link")
    }
  }

  async function handleToggleVisibility(file: FileRecord) {
    const next = file.visibility === "public" ? "private" : "public"
    setFiles((prev) => (prev ? prev.map((f) => (f.id === file.id ? { ...f, visibility: next } : f)) : null))

    try {
      await setVisibility(file.id, next)
      toast.success(next === "public" ? "File is now public" : "File is now private")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update visibility")
      refresh()
    }
  }

  async function handleRenameFile(name: string) {
    if (!renameFileTarget) return
    try {
      await renameFile(renameFileTarget.id, name)
      refresh()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not rename file")
      throw err
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
      throw err
    }
  }

  const isEmpty = files !== null && files.length === 0 && folders.length === 0
  const isRootHero =
    (isFolderMode && mode.folderId === "root" && parents.length === 0 && isEmpty) || (isHomeMode && isEmpty)

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4 md:p-8">
      {isFolderMode && <FolderBreadcrumb parents={parents} current={currentFolder} />}

      {showFolders && visibleFolders.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className={SECTION_LABEL}>Folders</span>
          <FolderGrid
            folders={visibleFolders}
            onRename={setRenameTarget}
            onTrash={handleTrashFolder}
            onToggleStar={handleToggleStarFolder}
            onDropFile={handleDropFileToFolder}
          />
        </div>
      )}

      <Card className="border border-lavender-mist bg-eclipse-black text-paper-white">
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
                  Use the New button in the sidebar or drag and drop files anywhere to upload.
                </p>
              </div>
            ) : (
              <div className="py-12 text-center font-mono text-sm text-ash-wisp">
                {mode.type === "recent"
                  ? "No files uploaded yet."
                  : mode.type === "starred"
                    ? "Nothing starred yet."
                    : mode.type === "shared"
                      ? "Nothing shared with you yet."
                      : "Nothing here yet. Use the New button in the sidebar."}
              </div>
            )
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <FolderGlyph empty className="w-16 opacity-80" />
              <p className="font-mono text-sm text-ash-wisp">No files in this folder yet.</p>
            </div>
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
                    onSortChange={(key: SortKey, direction: SortDirection) => {
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
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onPreview={setPreviewFile}
                  onHoverFile={setFocusedFileId}
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
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
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

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedFiles={selectedFiles}
        onClearSelection={handleClearSelection}
        onBulkDownload={handleBulkDownload}
        onBulkTrash={handleBulkTrash}
        onBulkToggleStar={handleBulkToggleStar}
        onBulkMove={handleBulkMove}
        readOnly={readOnly}
      />

      <FilePreviewDialog
        file={previewFile}
        files={visibleFiles}
        onSelectFile={setPreviewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      />

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
