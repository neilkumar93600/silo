// --- Client-side file listing cache ---
// Session-scoped so a page refresh can repaint the last known listing
// instantly instead of a blank skeleton, then silently revalidate over the
// network. Cleared on sign-out so a shared device never flashes a
// previous account's files.
const FILE_CACHE_PREFIX = "silo:fm:"

export function readFileCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(FILE_CACHE_PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeFileCache(key: string, data: unknown) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(FILE_CACHE_PREFIX + key, JSON.stringify(data))
  } catch {
    // storage full/unavailable — cache is best-effort, safe to skip
  }
}

export function clearFileCache() {
  if (typeof window === "undefined") return
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i)
    if (key?.startsWith(FILE_CACHE_PREFIX)) sessionStorage.removeItem(key)
  }
}

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
  sharedAt?: string
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
  // Direct files + subfolders inside this folder. Only populated by
  // endpoints that compute it (folder browsing, starred) — undefined
  // elsewhere, which callers should treat as "unknown, assume non-empty".
  itemCount?: number
}

// folderId omitted -> every file regardless of folder (Recent). "root" ->
// top-level only. Any other id -> files inside that folder. q, when set,
// searches every folder and ignores folderId.
export function listFiles(opts?: { folderId?: string; cursor?: string; q?: string }) {
  const params = new URLSearchParams()
  if (opts?.folderId) params.set("folderId", opts.folderId)
  if (opts?.cursor) params.set("cursor", opts.cursor)
  if (opts?.q) params.set("q", opts.q)
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

export function getDownloadUrl(fileId: string, inline = false) {
  const query = inline ? "?inline=true" : ""
  return request<{ url: string }>(`/api/files/${fileId}/download${query}`)
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

export function listHomeFeed() {
  return request<{ files: FileRecord[] }>("/api/home")
}

// --- Notifications ---

export type NotificationType = "file_shared" | (string & {})

export interface NotificationRecord {
  id: string
  type: NotificationType
  title: string
  body: string
  fileId: string | null
  read: boolean
  createdAt: string
}

export function listNotifications() {
  return request<{ items: NotificationRecord[]; unreadCount: number }>("/api/notifications")
}

export function markNotificationRead(id: string) {
  return request<NotificationRecord>(`/api/notifications/${id}/read`, { method: "POST" })
}

export function markAllNotificationsRead() {
  return request<void>("/api/notifications/read-all", { method: "POST" })
}

export function deleteNotification(id: string) {
  return request<void>(`/api/notifications/${id}`, { method: "DELETE" })
}

export interface NotificationPreferences {
  userId: string
  notifyOnFileShared: boolean
}

export function getNotificationPreferences() {
  return request<NotificationPreferences>("/api/notification-preferences")
}

export function updateNotificationPreferences(patch: Partial<Pick<NotificationPreferences, "notifyOnFileShared">>) {
  return request<NotificationPreferences>("/api/notification-preferences", {
    method: "PATCH",
    body: JSON.stringify(patch),
  })
}

// --- Assistant ---

export type AssistantRole = "user" | "assistant" | "tool"

export interface AssistantMessage {
  id: string
  role: AssistantRole
  content: string | null
  toolName: string | null
  createdAt: string
}

export interface AssistantConversationSummary {
  id: string
  title: string | null
  updatedAt: string
}

export interface AssistantPending {
  summary: string
  calls: unknown[]
}

export interface AssistantConversationDetail {
  id: string
  title: string | null
  pending: AssistantPending | null
  createdAt: string
  updatedAt: string
}

export function listAssistantConversations() {
  return request<AssistantConversationSummary[]>("/api/assistant/conversations")
}

export function createAssistantConversation() {
  return request<AssistantConversationDetail>("/api/assistant/conversations", { method: "POST" })
}

export function getAssistantConversation(id: string) {
  return request<AssistantConversationDetail>(`/api/assistant/conversations/${id}`)
}

export function getAssistantMessages(id: string) {
  return request<AssistantMessage[]>(`/api/assistant/conversations/${id}/messages`)
}

export function deleteAssistantConversation(id: string) {
  return request<void>(`/api/assistant/conversations/${id}`, { method: "DELETE" })
}

export type AssistantStreamEvent =
  | { type: "token"; data: string }
  | { type: "pending_confirmation"; data: AssistantPending }
  | { type: "done"; data: null }
  | { type: "error"; data: string }

function parseSSEFrame(frame: string): AssistantStreamEvent | null {
  let event = ""
  let data = ""
  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim()
    else if (line.startsWith("data:")) data += line.slice(5).trim()
  }
  if (!event) return null
  return { type: event, data: data ? JSON.parse(data) : null } as AssistantStreamEvent
}

// SSE consumed by hand (fetch + a stream reader) rather than EventSource,
// since EventSource can't send a POST body.
async function* streamSSE(path: string, body: unknown): AsyncGenerator<AssistantStreamEvent> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok || !res.body) {
    const parsed = await res.json().catch(() => null)
    throw new ApiError(res.status, parsed?.error?.code ?? "unknown_error", parsed?.error?.message ?? res.statusText)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let sepIndex: number
    while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
      const event = parseSSEFrame(buffer.slice(0, sepIndex))
      buffer = buffer.slice(sepIndex + 2)
      if (event) yield event
    }
  }
}

export function sendAssistantMessage(conversationId: string, content: string) {
  return streamSSE(`/api/assistant/conversations/${conversationId}/messages`, { content })
}

export function confirmAssistantAction(conversationId: string, approve: boolean) {
  return streamSSE(`/api/assistant/conversations/${conversationId}/confirm`, { approve })
}
