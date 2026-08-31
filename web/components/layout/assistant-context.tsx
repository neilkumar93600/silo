"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  ApiError,
  confirmAssistantAction,
  createAssistantConversation,
  deleteAssistantConversation,
  getAssistantConversation,
  getAssistantMessages,
  listAssistantConversations,
  sendAssistantMessage,
  type AssistantConversationSummary,
  type AssistantMessage,
  type AssistantPending,
  type FileRecord,
} from "@/lib/api"
import { formatBytes } from "@/lib/format"

// Silvi's visible state, driven off the actual SSE loop phase - not a
// decorative label. See runStream below for the transitions.
export type SilviStatus = "idle" | "thinking" | "typing" | "checking" | "processing"

// Live trace of the current turn's tool calls - reset each time runStream
// starts, and never persisted (a page reload just won't show past turns'
// trace, same as streamingContent).
export type ToolTraceEntry = { id: string; name: string; label: string; status: "running" | "done" | "error" }

type AssistantContextValue = {
  open: boolean
  toggle: () => void
  close: () => void
  conversations: AssistantConversationSummary[]
  activeConversationId: string | null
  messages: AssistantMessage[]
  streamingContent: string
  isStreaming: boolean
  pending: AssistantPending | null
  status: SilviStatus
  toolTrace: ToolTraceEntry[]
  sendMessage: (content: string) => Promise<void>
  askAboutFile: (file: FileRecord) => Promise<void>
  confirm: (approve: boolean) => Promise<void>
  startNewConversation: () => void
  selectConversation: (id: string) => Promise<void>
  removeConversation: (id: string) => Promise<void>
  refreshConversationList: () => Promise<void>
}

const AssistantContext = React.createContext<AssistantContextValue | null>(null)

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [conversations, setConversations] = React.useState<AssistantConversationSummary[]>([])
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null)
  const [messages, setMessages] = React.useState<AssistantMessage[]>([])
  const [streamingContent, setStreamingContent] = React.useState("")
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [pending, setPending] = React.useState<AssistantPending | null>(null)
  const [status, setStatus] = React.useState<SilviStatus>("idle")
  const [toolTrace, setToolTrace] = React.useState<ToolTraceEntry[]>([])

  const refreshConversationList = React.useCallback(async () => {
    try {
      setConversations(await listAssistantConversations())
    } catch {
      // Silent: the history dropdown just stays empty/stale, not worth a toast.
    }
  }, [])

  React.useEffect(() => {
    if (open) {
      refreshConversationList()
    }
  }, [open, refreshConversationList])

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Toggle assistant on Ctrl/Cmd + J
      if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // initialStatus: "thinking" for a fresh message, "processing" for a
  // confirm/decline (the server executes the approved tool before the
  // resumed loop's first token). Both settle into "typing" once tokens
  // start, and "checking" if the model pauses on a new confirmation.
  async function runStream(
    generator: AsyncGenerator<{ type: string; data: unknown }>,
    conversationId: string,
    initialStatus: SilviStatus,
  ) {
    setStatus(initialStatus)
    setIsStreaming(true)
    setStreamingContent("")
    setToolTrace([])
    let gotToken = false
    let sawPending = false
    try {
      for await (const event of generator) {
        if (event.type === "token") {
          if (!gotToken) {
            gotToken = true
            setStatus("typing")
          }
          setStreamingContent((s) => s + (event.data as string))
        } else if (event.type === "pending_confirmation") {
          sawPending = true
          setPending(event.data as AssistantPending)
          setStatus("checking")
        } else if (event.type === "tool_call_start") {
          const call = event.data as { id: string; name: string; label: string }
          setToolTrace((prev) => [...prev, { ...call, status: "running" }])
        } else if (event.type === "tool_call_result") {
          const result = event.data as { id: string; ok: boolean }
          setToolTrace((prev) =>
            prev.map((t) => (t.id === result.id ? { ...t, status: result.ok ? "done" : "error" } : t)),
          )
        } else if (event.type === "error") {
          toast.error(event.data as string)
        }
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Assistant request failed")
    } finally {
      try {
        const freshMsgs = await getAssistantMessages(conversationId)
        setMessages(freshMsgs)
      } catch {
        // conversation may have just been created; a failed refresh isn't fatal
      }
      setIsStreaming(false)
      setStreamingContent("")
      if (!sawPending) setStatus("idle")
      refreshConversationList()
    }
  }

  async function sendMessage(content: string) {
    let conversationId = activeConversationId
    if (!conversationId) {
      try {
        const created = await createAssistantConversation()
        conversationId = created.id
        setActiveConversationId(conversationId)
      } catch (err) {
        toast.error(err instanceof ApiError ? err.message : "Could not start a conversation")
        return
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, role: "user", content, toolName: null, createdAt: new Date().toISOString() },
    ])

    await runStream(sendAssistantMessage(conversationId, content), conversationId, "thinking")
  }

  async function askAboutFile(file: FileRecord) {
    setOpen(true)
    const prompt = `Can you inspect the file "${file.originalName}" (${formatBytes(file.sizeBytes)}, type: ${file.mimeType}) and tell me what it is and any actions or insights available?`
    await sendMessage(prompt)
  }

  async function confirm(approve: boolean) {
    if (!activeConversationId) return
    setPending(null)
    await runStream(confirmAssistantAction(activeConversationId, approve), activeConversationId, "processing")
  }

  function startNewConversation() {
    setActiveConversationId(null)
    setMessages([])
    setPending(null)
    setStatus("idle")
    setStreamingContent("")
    setToolTrace([])
  }

  async function selectConversation(id: string) {
    setActiveConversationId(id)
    setStreamingContent("")
    setToolTrace([])
    try {
      const [detail, msgs] = await Promise.all([getAssistantConversation(id), getAssistantMessages(id)])
      setPending(detail.pending)
      setStatus(detail.pending ? "checking" : "idle")
      setMessages(msgs)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not load that conversation")
    }
  }

  async function removeConversation(id: string) {
    try {
      await deleteAssistantConversation(id)
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeConversationId === id) startNewConversation()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete that conversation")
    }
  }

  const value: AssistantContextValue = {
    open,
    toggle: () => setOpen((v) => !v),
    close: () => setOpen(false),
    conversations,
    activeConversationId,
    messages,
    streamingContent,
    isStreaming,
    pending,
    status,
    toolTrace,
    sendMessage,
    askAboutFile,
    confirm,
    startNewConversation,
    selectConversation,
    removeConversation,
    refreshConversationList,
  }

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}

export function useAssistant() {
  const context = React.useContext(AssistantContext)
  if (!context) {
    throw new Error("useAssistant must be used within an AssistantProvider.")
  }
  return context
}
