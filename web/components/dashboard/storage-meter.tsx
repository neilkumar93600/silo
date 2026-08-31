"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { formatBytes } from "@/lib/format"
import { listFiles } from "@/lib/api"

const DISPLAY_CAP_BYTES = 5 * 1024 * 1024 * 1024

export function StorageMeter() {
  const [usedBytes, setUsedBytes] = useState<number | null>(null)

  useEffect(() => {
    let ignore = false

    listFiles()
      .then((res) => {
        if (!ignore) setUsedBytes(res.items.reduce((sum, f) => sum + f.sizeBytes, 0))
      })
      .catch(() => {
        if (!ignore) setUsedBytes(0)
      })

    return () => {
      ignore = true
    }
  }, [])

  if (usedBytes === null) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-lavender-mist bg-cream-canvas p-3">
        <Skeleton className="h-1.5 w-full rounded-full bg-lavender-mist" />
        <Skeleton className="h-3 w-24 rounded-full bg-lavender-mist" />
      </div>
    )
  }

  const fraction = Math.min(usedBytes / DISPLAY_CAP_BYTES, 1)

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-lavender-mist bg-cream-canvas p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ink-black">Storage</span>
        <span className="font-mono text-[11px] text-laser-violet">{Math.round(fraction * 100)}%</span>
      </div>
      <Progress value={fraction * 100} className="h-1.5 bg-carbon-ink [&>div]:bg-laser-violet" />
      <p className="font-mono text-[11px] text-ash-wisp">
        {formatBytes(usedBytes)} / {formatBytes(DISPLAY_CAP_BYTES)}
      </p>
    </div>
  )
}

