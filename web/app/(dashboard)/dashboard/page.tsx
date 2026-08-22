"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardTopbar } from "@/components/layout/dashboard-topbar"
import { FileSearchInput } from "@/components/dashboard/file-search-input"
import { FileManager } from "@/components/dashboard/file-manager"
import { DashboardTourCard } from "@/components/dashboard/dashboard-tour-card"

function DashboardPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "")

  // The `q` param is a one-time seed from the command palette ("jump to this
  // file"), not a persisted view — strip it right after reading it so a
  // later reload starts from an unfiltered home page instead of silently
  // re-applying a search from a past visit (which was hiding new uploads).
  useEffect(() => {
    if (searchParams.get("q")) router.replace("/dashboard")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col h-full">
      <DashboardTopbar title="Files">
        <FileSearchInput value={query} onChange={setQuery} />
      </DashboardTopbar>
      <div className="flex-1 overflow-y-auto">
        <FileManager query={query} mode={{ type: "home" }} />
      </div>
      <DashboardTourCard />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardPageContent />
    </Suspense>
  )
}
