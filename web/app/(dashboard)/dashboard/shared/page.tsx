"use client"

import { useState } from "react"
import { DashboardTopbar } from "@/components/layout/dashboard-topbar"
import { FileSearchInput } from "@/components/dashboard/file-search-input"
import { FileManager } from "@/components/dashboard/file-manager"

export default function SharedWithMePage() {
  const [query, setQuery] = useState("")

  return (
    <>
      <DashboardTopbar title="Shared with me">
        <FileSearchInput value={query} onChange={setQuery} />
      </DashboardTopbar>
      <FileManager query={query} mode={{ type: "shared" }} />
    </>
  )
}
