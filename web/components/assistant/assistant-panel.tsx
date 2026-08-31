"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  SendIcon,
  PlusIcon,
  HistoryIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
  CopyIcon,
  FolderIcon,
  HardDriveIcon,
  StarIcon,
  ClockIcon,
  AlertTriangleIcon,
  ArrowUpRightIcon,
} from "lucide-react"

import { useAssistant, type SilviStatus } from "@/components/layout/assistant-context"
import { useSidebarLayout } from "@/components/layout/sidebar-context"
import { SilviOrb } from "@/components/assistant/silvi-orb"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { cn } from "@/lib/utils"

// Status badge configuration adhering to Getharvest DESIGN.md tokens
const STATUS_BADGE: Record<SilviStatus, { label: string; className: string }> = {
  idle: {
    label: "Ready",
    className: "badge-harvest",
  },
  thinking: {
    label: "Thinking...",
    className: "bg-harvest-flame/10 text-harvest-flame border-harvest-flame/30 animate-pulse",
  },
  typing: {
    label: "Generating...",
    className: "bg-harvest-flame/10 text-harvest-flame border-harvest-flame/30",
  },
  checking: {
    label: "Action Required",
    className: "bg-destructive/10 text-destructive border-destructive/30 animate-pulse",
  },
  processing: {
    label: "Processing...",
    className: "bg-harvest-flame/10 text-harvest-flame border-harvest-flame/30 animate-pulse",
  },
}

// Markdown and Code formatting helper for rich assistant responses
function MarkdownContent({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)

  function copyCode(text: string, index: number) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Split by code blocks ```...```
  const parts = React.useMemo(() => {
    const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
    const result: Array<{ type: "text" | "code"; lang?: string; content: string }> = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: "text", content: content.slice(lastIndex, match.index) })
      }
      result.push({ type: "code", lang: match[1] || "text", content: match[2].trimEnd() })
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      result.push({ type: "text", content: content.slice(lastIndex) })
    }

    return result
  }, [content])

  return (
    <div className="flex flex-col gap-2 text-[13.5px] leading-relaxed break-words text-foreground">
      {parts.map((part, i) => {
        if (part.type === "code") {
          return (
            <div
              key={i}
              className="my-2 rounded-lg border border-border/80 bg-white shadow-harvest-sm overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3 py-1.5 text-[11px] font-mono text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider text-harvest-flame">
                  {part.lang}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(part.content, i)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedIndex === i ? (
                    <>
                      <CheckIcon className="size-3 text-harvest-flame" />
                      <span className="text-harvest-flame">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="size-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-xs leading-normal text-ink-black bg-white">
                <code>{part.content}</code>
              </pre>
            </div>
          )
        }

        // Text parsing with inline bold, lists, and inline code
        const lines = part.content.split("\n")
        return (
          <div key={i} className="flex flex-col gap-1">
            {lines.map((line, lineIdx) => {
              if (line.startsWith("### ")) {
                return (
                  <h4 key={lineIdx} className="font-semibold text-sm text-harvest-flame mt-2 mb-0.5">
                    {line.replace("### ", "")}
                  </h4>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h3 key={lineIdx} className="font-semibold text-[15px] text-harvest-flame mt-2.5 mb-1">
                    {line.replace("## ", "")}
                  </h3>
                )
              }
              if (line.startsWith("- ") || line.startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 ml-1 my-0.5">
                    <span className="size-1.5 rounded-full bg-harvest-flame shrink-0 mt-2" />
                    <span>{parseInlineFormatting(line.slice(2))}</span>
                  </div>
                )
              }
              if (/^\d+\.\s/.test(line)) {
                const match = line.match(/^(\d+)\.\s(.*)$/)
                if (match) {
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 ml-1 my-0.5">
                      <span className="font-mono text-xs font-semibold text-harvest-flame shrink-0 mt-0.5">
                        {match[1]}.
                      </span>
                      <span>{parseInlineFormatting(match[2])}</span>
                    </div>
                  )
                }
              }
              if (!line.trim()) {
                return <div key={lineIdx} className="h-1.5" />
              }
              return <p key={lineIdx}>{parseInlineFormatting(line)}</p>
            })}
          </div>
        )
      })}
    </div>
  )
}

function parseInlineFormatting(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)
  return parts.map((seg, idx) => {
    if (seg.startsWith("**") && seg.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-harvest-flame">
          {seg.slice(2, -2)}
        </strong>
      )
    }
    if (seg.startsWith("`") && seg.endsWith("`")) {
      return (
        <code
          key={idx}
          className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs font-medium text-harvest-flame border border-border/50"
        >
          {seg.slice(1, -1)}
        </code>
      )
    }
    return seg
  })
}

function AssistantMessageBubble({
  role,
  content,
  createdAt,
  isStreaming = false,
  status = "idle",
}: {
  role: "user" | "assistant"
  content: string
  createdAt?: string
  isStreaming?: boolean
  status?: SilviStatus
}) {
  const [copied, setCopied] = React.useState(false)

  function copyMessage() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (role === "user") {
    return (
      <div className="flex flex-col items-end gap-1 pl-8">
        <div className="rounded-lg bg-harvest-flame px-3.5 py-2.5 text-xs text-white shadow-harvest-sm leading-relaxed max-w-[85%] whitespace-pre-wrap">
          {content}
        </div>
        {createdAt && (
          <span className="text-[10px] text-muted-foreground px-1 font-mono">
            {new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-2.5 pr-4">
      <div className="mt-0.5 shrink-0">
        <SilviOrb status={isStreaming ? "typing" : "idle"} size={24} showGlow={isStreaming} interactive={false} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="relative rounded-lg border border-border/80 bg-card p-3.5 shadow-harvest-sm">
          <div className="relative">
            <MarkdownContent content={content} />
            {isStreaming && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block w-2 h-3.5 ml-1 rounded-xs bg-harvest-flame align-middle shadow-[0_0_8px_rgba(250,93,0,0.5)]"
              />
            )}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-1.5 text-[11px] text-muted-foreground">
            <span className="font-mono text-[10px] flex items-center gap-1.5">
              {isStreaming ? (
                <>
                  <span className="inline-block size-1.5 rounded-full bg-harvest-flame animate-pulse" />
                  <span className="text-harvest-flame font-sans font-medium">Silvi is typing...</span>
                </>
              ) : createdAt ? (
                new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              ) : (
                "Just now"
              )}
            </span>
            {!isStreaming && (
              <button
                type="button"
                onClick={copyMessage}
                className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                aria-label="Copy response"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3 text-harvest-flame" />
                    <span className="text-harvest-flame text-[10px]">Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PendingConfirmationCard() {
  const { pending, confirm, isStreaming } = useAssistant()
  if (!pending) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex flex-col gap-3 rounded-lg border-2 border-destructive/40 bg-destructive/10 p-4 shadow-sm"
    >
      <div className="flex items-start gap-2.5">
        <div className="rounded-full bg-destructive/10 p-1.5 text-destructive shrink-0 mt-0.5">
          <AlertTriangleIcon className="size-4" />
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-xs font-semibold text-destructive">Action Confirmation Required</span>
          <p className="text-xs text-foreground/80 leading-relaxed">{pending.summary}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-destructive/20">
        <Button
          size="sm"
          onClick={() => confirm(true)}
          disabled={isStreaming}
          className="h-8 gap-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/90 px-3 text-xs font-medium"
        >
          <CheckIcon className="size-3.5" />
          Confirm Action
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => confirm(false)}
          disabled={isStreaming}
          className="h-8 gap-1.5 rounded-lg border-border text-foreground hover:bg-muted px-3 text-xs"
        >
          <XIcon className="size-3.5" />
          Cancel
        </Button>
      </div>
    </motion.div>
  )
}

function AssistantHistoryMenu() {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    removeConversation,
    startNewConversation,
    refreshConversationList,
  } = useAssistant()

  const [open, setOpen] = React.useState(false)

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (isOpen) {
      refreshConversationList()
    }
  }

  const trigger = (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Conversation history"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
    >
      <HistoryIcon className="size-4" />
    </Button>
  )

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Conversation history"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <HistoryIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-harvest-flame">
            Conversations
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              startNewConversation()
              setOpen(false)
            }}
            className="gap-2 font-medium text-harvest-flame"
          >
            <PlusIcon className="size-4" />
            New conversation
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {conversations.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-muted-foreground">
            No previous conversations
          </div>
        ) : (
          <DropdownMenuGroup>
            {conversations.map((c) => {
              const isActive = c.id === activeConversationId
              return (
                <DropdownMenuItem
                  key={c.id}
                  onClick={() => {
                    selectConversation(c.id)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex items-center justify-between gap-2 text-xs group/item",
                    isActive && "bg-accent text-primary font-medium"
                  )}
                >
                  <span className="truncate flex-1">{c.title ?? "New conversation"}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Delete conversation"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeConversation(c.id)
                    }}
                    className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors rounded-xs hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2Icon className="size-3.5" />
                  </span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const QUICK_PROMPTS = [
  {
    icon: ClockIcon,
    title: "Recent Files",
    prompt: "Show me all files modified in the past 7 days.",
  },
  {
    icon: HardDriveIcon,
    title: "Storage Summary",
    prompt: "What files and folders are using the most storage space?",
  },
  {
    icon: StarIcon,
    title: "Starred Items",
    prompt: "List all my starred documents and files with their paths.",
  },
  {
    icon: FolderIcon,
    title: "Organize Drive",
    prompt: "Help me find duplicate files or empty folders to clean up.",
  },
]

function AssistantComposer({ onQuickPrompt }: { onQuickPrompt: (prompt: string) => void }) {
  const { sendMessage, isStreaming, pending, status } = useAssistant()
  const [value, setValue] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const disabled = isStreaming || pending !== null

  function submit() {
    const content = value.trim()
    if (!content || disabled) return
    setValue("")
    sendMessage(content)
  }

  React.useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [disabled])

  return (
    <div className="flex flex-col gap-2 border-t border-border bg-card p-3">
      {/* Action Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {QUICK_PROMPTS.slice(0, 3).map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onQuickPrompt(item.prompt)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-harvest-flame/40 hover:bg-accent hover:text-harvest-flame hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <item.icon className="size-3 text-harvest-flame" />
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      <div className="relative flex items-end gap-2 rounded-lg border border-border bg-background p-2 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={
            pending
              ? "Resolve the confirmation card above first…"
              : "Ask Silvi to find, organize, or manage files…"
          }
          disabled={disabled}
          rows={1}
          className="min-h-9 max-h-32 flex-1 resize-none border-0 bg-transparent p-1 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none leading-normal"
        />
        <Button
          size="icon-sm"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="btn-primary-harvest size-8 disabled:opacity-40 transition-all cursor-pointer"
        >
          {isStreaming ? <Spinner className="size-3.5" /> : <SendIcon className="size-3.5" />}
        </Button>
      </div>
      <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground">
        <span>Silvi AI File Assistant</span>
        <span>Enter to send • Shift+Enter for new line</span>
      </div>
    </div>
  )
}

export function AssistantPanel() {
  const {
    open,
    close,
    messages,
    streamingContent,
    isStreaming,
    pending,
    status,
    toolTrace,
    startNewConversation,
    sendMessage,
  } = useAssistant()
  const { isMobile } = useSidebarLayout()

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const visibleMessages = messages.filter(
    (m) => m.role === "user" || (m.role === "assistant" && m.content)
  )

  React.useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [open, visibleMessages.length, streamingContent, status])

  // Chat header badge/orb always reads as idle/Ready, regardless of the real
  // status - the working indicator further down (status={status}) still
  // shows real progress, this is just the header's resting face.
  const statusConfig = STATUS_BADGE.idle

  const panelContent = (
    <div className="flex h-full w-full flex-col bg-card text-foreground">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 bg-card">
        <div className="flex items-center gap-2.5 min-w-0">
          <SilviOrb status="idle" size={28} showGlow={false} />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-harvest-flame">Silvi</span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
                  statusConfig.className
                )}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={startNewConversation}
                    aria-label="New conversation"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                }
              />
              <TooltipContent side="bottom">New conversation</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AssistantHistoryMenu />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={close}
                    aria-label="Close assistant"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <XIcon className="size-4" />
                  </Button>
                }
              />
              <TooltipContent side="bottom">Close panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Messages / Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {visibleMessages.length === 0 && !isStreaming ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-4"
            >
              <SilviOrb status="idle" size={68} showGlow showRings />
            </motion.div>
            <TypingAnimation
              duration={40}
              className="text-base font-semibold text-harvest-flame mb-1"
              showCursor={false}
            >
              Hi, I'm Silvi
            </TypingAnimation>
            <p className="text-xs text-muted-foreground max-w-xs mb-6 leading-relaxed">
              Your intelligent Silo assistant. Ask me to search files, check storage breakdown, or organize your drive.
            </p>

            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(item.prompt)}
                  className="group flex items-center justify-between rounded-xl border border-border/80 bg-background p-3 text-left hover:border-primary/40 hover:bg-accent/50 hover:-translate-y-0.5 active:scale-[0.99] transition-all shadow-harvest-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="rounded-lg bg-accent/60 p-2 text-harvest-flame group-hover:bg-accent transition-colors">
                      <item.icon className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-foreground group-hover:text-primary">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        {item.prompt}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRightIcon className="size-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleMessages.map((m) => (
              <AssistantMessageBubble
                key={m.id}
                role={m.role as "user" | "assistant"}
                content={m.content ?? ""}
                createdAt={m.createdAt}
              />
            ))}

            {isStreaming && streamingContent && (
              <AssistantMessageBubble
                role="assistant"
                content={streamingContent}
                isStreaming={true}
                status={status}
              />
            )}

            {isStreaming && !streamingContent && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-lg border border-border/80 bg-card p-3.5 shadow-harvest-sm"
              >
                <SilviOrb status={status} size={26} showGlow showRings />
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-harvest-flame">
                      {status === "thinking"
                        ? "Silvi is thinking..."
                        : status === "processing"
                        ? "Silvi is running action..."
                        : "Silvi is working..."}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-harvest-flame animate-bounce [animation-delay:-0.3s]" />
                      <span className="size-1.5 rounded-full bg-harvest-flame animate-bounce [animation-delay:-0.15s]" />
                      <span className="size-1.5 rounded-full bg-harvest-flame/60 animate-bounce" />
                    </div>
                  </div>
                  {toolTrace.length > 0 ? (
                    <div className="flex flex-col gap-1 mt-0.5">
                      {toolTrace.map((call) => (
                        <motion.div
                          key={call.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1.5 text-[11px]"
                        >
                          {call.status === "running" ? (
                            <Spinner className="size-3 shrink-0 text-muted-foreground" />
                          ) : call.status === "done" ? (
                            <CheckIcon className="size-3 shrink-0 text-signal-green" />
                          ) : (
                            <XIcon className="size-3 shrink-0 text-destructive" />
                          )}
                          <span
                            className={cn(
                              "truncate",
                              call.status === "running" ? "text-muted-foreground" : "text-foreground/80"
                            )}
                          >
                            {call.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <TypingAnimation
                      duration={30}
                      className="text-[11px] text-muted-foreground"
                      showCursor={true}
                      cursorStyle="line"
                    >
                      {status === "thinking"
                        ? "Analyzing storage, inspecting directories, or preparing files..."
                        : status === "processing"
                        ? "Executing folder or file operation safely..."
                        : "Generating detailed response..."}
                    </TypingAnimation>
                  )}
                </div>
              </motion.div>
            )}

            {pending && <PendingConfirmationCard />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <AssistantComposer onQuickPrompt={(p) => sendMessage(p)} />
    </div>
  )

  // Mobile drawer vs Desktop docked layout
  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm sm:max-w-md bg-card shadow-2xl border-l border-border"
            >
              {panelContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Desktop side panel - smoothly docks beside content with animate width
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside
          key="silvi-docked-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 384, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
          className="relative flex h-screen flex-col border-l border-border bg-card shadow-xs overflow-hidden shrink-0 z-20"
        >
          <div className="w-full flex flex-col h-full min-w-0">
            {panelContent}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
