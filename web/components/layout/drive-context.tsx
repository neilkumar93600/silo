"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { createFolder, getDownloadUrl, type FileRecord, ApiError } from "@/lib/api"
import { uploadFile } from "@/lib/upload"
import { FolderNameDialog } from "@/components/dashboard/folder-name-dialog"

export type QueueItemStatus = "pending" | "uploading" | "done" | "error" | "cancelled"

export type QueueItem = {
  id: string
  name: string
  progress: number   // 0-1
  sizeBytes: number
  uploadedBytes: number
  speedBps: number   // bytes/sec, rolling estimate
  status: QueueItemStatus
  error: string | null
  mimeType?: string
}

const DANGEROUS_EXTENSIONS = new Set([
  "exe", "dll", "so", "msi", "bat", "cmd", "com", "scr", "ps1", "vbs",
  "vbe", "wsf", "wsh", "jar", "sh", "bash", "app", "apk", "deb", "rpm",
  "jse", "cpl", "reg", "gadget", "hta",
])

function isDangerous(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? ""
  return DANGEROUS_EXTENSIONS.has(ext)
}

type DriveContextValue = {
  uploads: QueueItem[]
  downloads: QueueItem[]
  activeFolderId: string | null
  registerFolder: (folderId: string | null, refresh: (() => void) | null) => void
  uploadFiles: (files: FileList | File[], folderId: string) => void
  downloadFile: (file: FileRecord) => void
  requestNewFolder: () => void
  cancelUpload: (id: string) => void
  cancelDownload: (id: string) => void
}

const DriveContext = createContext<DriveContextValue | null>(null)

export function DriveProvider({ children }: { children: React.ReactNode }) {
  const [uploads, setUploads] = useState<QueueItem[]>([])
  const [downloads, setDownloads] = useState<QueueItem[]>([])
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const activeFolderRef = useRef<string | null>(null)
  const refreshRef = useRef<(() => void) | null>(null)
  const uploadAborts = useRef(new Map<string, AbortController>())
  const downloadAborts = useRef(new Map<string, AbortController>())

  const registerFolder = useCallback((folderId: string | null, refresh: (() => void) | null) => {
    activeFolderRef.current = folderId
    refreshRef.current = refresh
    setActiveFolderId(folderId)
  }, [])

  const maybeRefresh = useCallback((folderId: string) => {
    if (activeFolderRef.current === folderId) refreshRef.current?.()
  }, [])

  const uploadFiles = useCallback(
    (selected: FileList | File[], folderId: string) => {
      for (const file of Array.from(selected)) {
        if (isDangerous(file.name)) {
          toast.error(`"${file.name}" is not an allowed file type`)
          continue
        }

        const id = crypto.randomUUID()
        const controller = new AbortController()
        uploadAborts.current.set(id, controller)

        const newItem: QueueItem = {
          id,
          name: file.name,
          progress: 0,
          sizeBytes: file.size,
          uploadedBytes: 0,
          speedBps: 0,
          status: "uploading",
          error: null,
          mimeType: file.type,
        }
        setUploads((prev) => [...prev, newItem])

        let lastBytes = 0
        let lastTime = Date.now()

        uploadFile(
          file,
          (fraction) => {
            const now = Date.now()
            const uploaded = Math.round(fraction * file.size)
            const dt = (now - lastTime) / 1000
            const db = uploaded - lastBytes
            const speedBps = dt > 0 ? db / dt : 0
            lastBytes = uploaded
            lastTime = now

            setUploads((prev) =>
              prev.map((u) =>
                u.id === id ? { ...u, progress: fraction, uploadedBytes: uploaded, speedBps } : u
              )
            )
          },
          folderId === "root" ? undefined : folderId,
          controller.signal,
        )
          .then(() => {
            uploadAborts.current.delete(id)
            // Keep as "done" briefly so the user sees the checkmark, then remove
            setUploads((prev) =>
              prev.map((u) => (u.id === id ? { ...u, progress: 1, status: "done" } : u))
            )
            setTimeout(() => {
              setUploads((prev) => prev.filter((u) => u.id !== id))
            }, 2500)
            maybeRefresh(folderId)
          })
          .catch((err) => {
            uploadAborts.current.delete(id)
            const message = err instanceof ApiError || err instanceof Error ? err.message : "Upload failed"
            const status: QueueItemStatus = message === "Upload cancelled" ? "cancelled" : "error"
            setUploads((prev) =>
              prev.map((u) => (u.id === id ? { ...u, error: message, status } : u))
            )
            if (status === "error") toast.error(`"${file.name}" failed to upload: ${message}`)
          })
      }
    },
    [maybeRefresh],
  )

  const downloadFile = useCallback((file: FileRecord) => {
    const id = crypto.randomUUID()
    const controller = new AbortController()
    downloadAborts.current.set(id, controller)
    const newItem: QueueItem = {
      id,
      name: file.originalName,
      progress: 0,
      sizeBytes: file.sizeBytes,
      uploadedBytes: 0,
      speedBps: 0,
      status: "uploading",
      error: null,
      mimeType: file.mimeType,
    }
    setDownloads((prev) => [...prev, newItem])

    ;(async () => {
      try {
        const { url } = await getDownloadUrl(file.id)
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok || !res.body) throw new Error("Download failed")

        const total = Number(res.headers.get("content-length") ?? 0) || file.sizeBytes
        const reader = res.body.getReader()
        const chunks: BlobPart[] = []
        let received = 0
        let lastBytes = 0
        let lastTime = Date.now()

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          received += value.length
          const fraction = total ? received / total : 0

          const now = Date.now()
          const dt = (now - lastTime) / 1000
          const db = received - lastBytes
          const speedBps = dt > 0.2 ? db / dt : 0
          if (dt > 0.2) { lastBytes = received; lastTime = now }

          setDownloads((prev) =>
            prev.map((d) =>
              d.id === id ? { ...d, progress: fraction, uploadedBytes: received, speedBps } : d
            )
          )
        }

        const blobUrl = URL.createObjectURL(new Blob(chunks, { type: file.mimeType }))
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = file.originalName
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000)

        downloadAborts.current.delete(id)
        setDownloads((prev) =>
          prev.map((d) => (d.id === id ? { ...d, progress: 1, status: "done" } : d))
        )
        setTimeout(() => {
          setDownloads((prev) => prev.filter((d) => d.id !== id))
        }, 2500)
      } catch (err) {
        downloadAborts.current.delete(id)
        const message = err instanceof ApiError || err instanceof Error ? err.message : "Download failed"
        const status: QueueItemStatus = (err as Error)?.name === "AbortError" ? "cancelled" : "error"
        setDownloads((prev) =>
          prev.map((d) => (d.id === id ? { ...d, error: message, status } : d))
        )
        if (status === "error") {
          toast.error(`"${file.originalName}" failed to download: ${message}`)
        }
      }
    })()
  }, [])

  const requestNewFolder = useCallback(() => setCreateOpen(true), [])

  const cancelUpload = useCallback((id: string) => {
    uploadAborts.current.get(id)?.abort()
  }, [])

  const cancelDownload = useCallback((id: string) => {
    downloadAborts.current.get(id)?.abort()
  }, [])

  async function handleCreateFolder(name: string) {
    const folderId = activeFolderRef.current
    if (!folderId) return
    try {
      await createFolder(name, folderId === "root" ? null : folderId)
      maybeRefresh(folderId)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create folder")
    }
  }

  return (
    <DriveContext.Provider
      value={{
        uploads,
        downloads,
        activeFolderId,
        registerFolder,
        uploadFiles,
        downloadFile,
        requestNewFolder,
        cancelUpload,
        cancelDownload,
      }}
    >
      {children}
      <FolderNameDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="New folder"
        submitLabel="Create"
        onSubmit={handleCreateFolder}
      />
    </DriveContext.Provider>
  )
}

export function useDrive() {
  const context = useContext(DriveContext)
  if (!context) throw new Error("useDrive must be used within a DriveProvider.")
  return context
}

export function useFolderSync(folderId: string | null, refresh: () => void) {
  const { registerFolder } = useDrive()
  useEffect(() => {
    registerFolder(folderId, refresh)
    return () => registerFolder(null, null)
  }, [folderId, refresh, registerFolder])
}
