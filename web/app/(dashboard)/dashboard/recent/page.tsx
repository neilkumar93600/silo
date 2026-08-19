"use client"

import { useState } from "react"
import { DashboardTopbar } from "@/components/layout/dashboard-topbar"
import { FileSearchInput } from "@/components/dashboard/file-search-input"
import { FileManager } from "@/components/dashboard/file-manager"

export default function RecentPage() {
  const [query, setQuery] = useState("")

  return (
    <div className="flex flex-col h-full">
      <DashboardTopbar title="Recent">
        <FileSearchInput value={query} onChange={setQuery} />
      </DashboardTopbar>
      <div className="flex-1 overflow-y-auto">
        <FileManager query={query} mode={{ type: "recent" }} />
      </div>
    </div>
  )
}
