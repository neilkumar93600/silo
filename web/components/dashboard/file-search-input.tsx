"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function FileSearchInput({
  value,
  onChange,
  placeholder = "Search files…",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div data-tour="tour-search" className="relative w-full max-w-md md:max-w-lg">
      <SearchIcon className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onChange("")
        }}
        className="h-9 w-full rounded-lg border-border bg-muted/40 pl-8 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-all shadow-xs"
      />
      {value.trim().length === 0 ? (
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground shadow-xs">
          ⌘K
        </kbd>
      ) : (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-xs p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  )
}
