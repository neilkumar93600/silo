import Link from "next/link"
import type { FolderRecord } from "@/lib/api"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function FolderBreadcrumb({
  parents,
  current,
}: {
  parents: FolderRecord[]
  current: FolderRecord | null
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          {current ? (
            <BreadcrumbLink render={<Link href="/dashboard" />}>Files</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Files</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {parents.map((folder) => (
          <span key={folder.id} className="flex items-center gap-1.5">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/dashboard/folder/${folder.id}`} />} className="truncate">
                {folder.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </span>
        ))}
        {current && (
          <span className="flex items-center gap-1.5">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate">{current.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </span>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
