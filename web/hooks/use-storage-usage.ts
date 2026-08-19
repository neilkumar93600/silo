import { useEffect, useState } from "react"
import { listFiles } from "@/lib/api"

export const STORAGE_CAP_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB

export function useStorageUsage() {
  const [usedBytes, setUsedBytes] = useState<number | null>(null)

  useEffect(() => {
    let ignore = false
    listFiles()
      .then((res) => {
        if (!ignore) setUsedBytes((res.items ?? []).reduce((sum, f) => sum + f.sizeBytes, 0))
      })
      .catch(() => {
        if (!ignore) setUsedBytes(0)
      })
    return () => {
      ignore = true
    }
  }, [])

  return usedBytes
}
