export class ApiError extends Error {
  code: string
  status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.code = code
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  })

  if (res.status === 204) {
    return undefined as T
  }

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const message = body?.error?.message ?? res.statusText
    const code = body?.error?.code ?? "unknown_error"
    throw new ApiError(res.status, code, message)
  }

  return body as T
}

export type FileVisibility = "private" | "public"

export interface FileRecord {
  id: string
  originalName: string
  mimeType: string
  sizeBytes: number
  visibility: FileVisibility
  status: "pending" | "uploaded"
  shareSlug: string
  folderId: string | null
  starred: boolean
  sharedBy?: { name: string; email: string }
  deletedAt: string | null
  createdAt: string
}

export interface FolderRecord {
  id: string
  name: string
  parentId: string | null
  starred: boolean
  deletedAt: string | null
  createdAt: string
}

// folderId omitted -> every file regardless of folder (Recent). "root" ->
// top-level only. Any other id -> files inside that folder.
export function listFiles(opts?: { folderId?: string; cursor?: string }) {
  const params = new URLSearchParams()
  if (opts?.folderId) params.set("folderId", opts.folderId)
  if (opts?.cursor) params.set("cursor", opts.cursor)
  const qs = params.toString()
  return request<{ items: FileRecord[]; nextCursor: string | null }>(`/api/files${qs ? `?${qs}` : ""}`)
}

export function requestUploadUrl(params: { filename: string; contentType: string; sizeBytes: number; folderId?: string }) {
  return request<{ fileId: string; uploadUrl: string }>("/api/files/upload-url", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

export function completeUpload(fileId: string) {
  return request<FileRecord>(`/api/files/${fileId}/complete`, { method: "POST" })
}

function patchFile(fileId: string, body: Record<string, unknown>) {
  return request<FileRecord>(`/api/files/${fileId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function setVisibility(fileId: string, visibility: FileVisibility) {
  return patchFile(fileId, { visibility })
}

export function renameFile(fileId: string, originalName: string) {
  return patchFile(fileId, { originalName })
}

export function moveFile(fileId: string, folderId: string | null) {
  return patchFile(fileId, { folderId })
}

export function starFile(fileId: string, starred: boolean) {
  return patchFile(fileId, { starred })
}

export interface ShareRecipient {
  userId: string
  name: string
  email: string
  sharedAt: string
}

export function listFileShares(fileId: string) {
  return request<ShareRecipient[]>(`/api/files/${fileId}/shares`)
}

export function addFileShare(fileId: string, email: string) {
  return request<ShareRecipient[]>(`/api/files/${fileId}/shares`, {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export function removeFileShare(fileId: string, userId: string) {
  return request<ShareRecipient[]>(`/api/files/${fileId}/shares/${userId}`, { method: "DELETE" })
}

// Soft delete — moves the file to Trash. Use permanentlyDeleteFile to
// actually remove it.
export function deleteFile(fileId: string) {
  return request<void>(`/api/files/${fileId}`, { method: "DELETE" })
}

export function getDownloadUrl(fileId: string) {
  return request<{ url: string }>(`/api/files/${fileId}/download`)
}

export function getShare(slug: string) {
  return request<{
    url: string
    file: { originalName: string; mimeType: string; sizeBytes: number; createdAt: string }
  }>(`/api/share/${slug}`)
}

export interface FolderContents {
  folder: FolderRecord | null
  parents: FolderRecord[]
  folders: FolderRecord[]
  files: FileRecord[]
}

export function listFolder(parentId: string) {
  return request<FolderContents>(`/api/folders?parentId=${encodeURIComponent(parentId)}`)
}

export function createFolder(name: string, parentId: string | null) {
  return request<FolderRecord>("/api/folders", {
    method: "POST",
    body: JSON.stringify({ name, parentId }),
  })
}

function patchFolder(folderId: string, body: Record<string, unknown>) {
  return request<FolderRecord>(`/api/folders/${folderId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function renameFolder(folderId: string, name: string) {
  return patchFolder(folderId, { name })
}

export function starFolder(folderId: string, starred: boolean) {
  return patchFolder(folderId, { starred })
}

// Soft delete — moves the folder (and everything inside it) to Trash.
export function trashFolder(folderId: string) {
  return request<void>(`/api/folders/${folderId}`, { method: "DELETE" })
}

export interface TrashContents {
  files: FileRecord[]
  folders: FolderRecord[]
}

export function listTrash() {
  return request<TrashContents>("/api/trash")
}

export function restoreFile(fileId: string) {
  return request<FileRecord>(`/api/trash/files/${fileId}/restore`, { method: "POST" })
}

export function restoreFolder(folderId: string) {
  return request<void>(`/api/trash/folders/${folderId}/restore`, { method: "POST" })
}

export function permanentlyDeleteFile(fileId: string) {
  return request<void>(`/api/trash/files/${fileId}`, { method: "DELETE" })
}

export function permanentlyDeleteFolder(folderId: string) {
  return request<void>(`/api/trash/folders/${folderId}`, { method: "DELETE" })
}

export function emptyTrash() {
  return request<void>("/api/trash", { method: "DELETE" })
}

export interface StarredContents {
  files: FileRecord[]
  folders: FolderRecord[]
}

export function listStarred() {
  return request<StarredContents>("/api/starred")
}

export interface SharedWithMeContents {
  files: FileRecord[]
}

export function listSharedWithMe() {
  return request<SharedWithMeContents>("/api/shared-with-me")
}
