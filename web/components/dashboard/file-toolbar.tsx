"use client"

import { ArrowUpDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export type SortKey = "date" | "name" | "size"
export type SortDirection = "asc" | "desc"

const SORT_LABELS: Record<SortKey, string> = {
  date: "Date uploaded",
  name: "Name",
  size: "Size",
}

export function FileSortMenu({
  sortKey,
  sortDirection,
  onSortChange,
}: {
  sortKey: SortKey
  sortDirection: SortDirection
  onSortChange: (key: SortKey, direction: SortDirection) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="border-lavender-mist bg-eclipse-black text-ink-black hover:border-laser-violet hover:bg-cream-canvas hover:text-laser-violet">
            <ArrowUpDownIcon data-icon="inline-start" />
            {SORT_LABELS[sortKey]}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="border-lavender-mist bg-eclipse-black text-ink-black">
        <DropdownMenuLabel className="font-mono text-[11px] uppercase text-ash-wisp">Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sortKey} onValueChange={(value) => onSortChange(value as SortKey, sortDirection)}>
          <DropdownMenuRadioItem value="date" className="hover:bg-cream-canvas hover:text-laser-violet">Date uploaded</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name" className="hover:bg-cream-canvas hover:text-laser-violet">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size" className="hover:bg-cream-canvas hover:text-laser-violet">Size</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className="bg-lavender-mist/60" />
        <DropdownMenuRadioGroup value={sortDirection} onValueChange={(value) => onSortChange(sortKey, value as SortDirection)}>
          <DropdownMenuRadioItem value="desc" className="hover:bg-cream-canvas hover:text-laser-violet">Descending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="asc" className="hover:bg-cream-canvas hover:text-laser-violet">Ascending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

