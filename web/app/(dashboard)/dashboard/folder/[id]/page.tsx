"use client"

import { use, useState } from "react"
import { DashboardTopbar } from "@/components/layout/dashboard-topbar"
import { FileSearchInput } from "@/components/dashboard/file-search-input"
import { FileManager } from "@/components/dashboard/file-manager"

export default function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [query, setQuery] = useState("")

  return (
    <div className="flex flex-col h-full">
      <DashboardTopbar title="Files">
        <FileSearchInput value={query} onChange={setQuery} />
      </DashboardTopbar>
      <div className="flex-1 overflow-y-auto">
        <FileManager key={id} query={query} mode={{ type: "folder", folderId: id }} />
      </div>
    </div>
  )
}
