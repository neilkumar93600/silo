import {
  FileIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  FileTextIcon,
  FileArchiveIcon,
  FileCodeIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

function toneFor(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "bg-violet-500/10 text-violet-600 dark:text-violet-400"
  if (mimeType.startsWith("video/")) return "bg-rose-500/10 text-rose-600 dark:text-rose-400"
  if (mimeType.startsWith("audio/")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  if (mimeType === "application/pdf" || mimeType.startsWith("text/")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  if (mimeType.includes("zip") || mimeType.includes("compressed") || mimeType.includes("tar"))
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
  if (mimeType.includes("json") || mimeType.includes("javascript") || mimeType.includes("xml"))
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  return "bg-muted text-muted-foreground"
}

function Glyph({ mimeType, className }: { mimeType: string; className?: string }) {
  const props = { className, strokeWidth: 1.5 }
  if (mimeType.startsWith("image/")) return <ImageIcon {...props} />
  if (mimeType.startsWith("video/")) return <VideoIcon {...props} />
  if (mimeType.startsWith("audio/")) return <MusicIcon {...props} />
  if (mimeType === "application/pdf" || mimeType.startsWith("text/")) return <FileTextIcon {...props} />
  if (mimeType.includes("zip") || mimeType.includes("compressed") || mimeType.includes("tar"))
    return <FileArchiveIcon {...props} />
  if (mimeType.includes("json") || mimeType.includes("javascript") || mimeType.includes("xml"))
    return <FileCodeIcon {...props} />
  return <FileIcon {...props} />
}

export function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  return <Glyph mimeType={mimeType} className={className} />
}

// Colored badge variant for list rows — a plain outline glyph disappears in
// a dense list; a tinted background per file category gives the table the
// same at-a-glance scannability as the reference dashboard.
export function FileTypeBadge({ mimeType, className }: { mimeType: string; className?: string }) {
  return (
    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", toneFor(mimeType), className)}>
      <Glyph mimeType={mimeType} className="size-4" />
    </span>
  )
}
