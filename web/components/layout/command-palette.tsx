"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  FolderIcon,
  HomeIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
  Trash2Icon,
  SettingsIcon,
  UploadCloudIcon,
  FolderPlusIcon,
  SparklesIcon,
} from "lucide-react"

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { listFiles, listFolder, type FileRecord, type FolderRecord } from "@/lib/api"
import { FileTypeIcon } from "@/components/shared/file-icon"
import { formatBytes } from "@/lib/format"
import { useAssistant } from "@/components/layout/assistant-context"
import { useDrive } from "@/components/layout/drive-context"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [files, setFiles] = useState<FileRecord[]>([])
  const [folders, setFolders] = useState<FolderRecord[]>([])
  const router = useRouter()
  const { toggle } = useAssistant()
  const { uploadFiles, requestNewFolder, activeFolderId } = useDrive()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Listen for Ctrl+K, Cmd+K, or / key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      } else if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Fetch recent files and folders when palette opens
  useEffect(() => {
    if (!open) return
    let ignore = false

    Promise.all([
      listFiles().catch(() => ({ items: [] })),
      listFolder("root").catch(() => ({ folders: [], files: [] })),
    ]).then(([filesRes, foldersRes]) => {
      if (!ignore) {
        setFiles(filesRes.items || [])
        setFolders(foldersRes.folders || [])
      }
    })

    return () => {
      ignore = true
    }
  }, [open])

  function handleSelect(callback: () => void) {
    setOpen(false)
    callback()
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files, activeFolderId || "root")
    }
  }

  const matchingFiles = query.trim()
    ? files.filter((f) => f.originalName.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5)
    : files.slice(0, 3)

  const matchingFolders = query.trim()
    ? folders.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 4)
    : folders.slice(0, 3)

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search files, folders, or actions… (Press Esc to close)"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[380px] p-2 text-ink-black">
          <CommandEmpty className="py-6 text-center text-xs text-silver-smoke">
            No matching files, folders, or commands found.
          </CommandEmpty>

          {/* Quick Actions */}
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() =>
                handleSelect(() => {
                  fileInputRef.current?.click()
                })
              }
              className="cursor-pointer"
            >
              <UploadCloudIcon className="size-4 text-laser-violet" />
              <span>Upload files</span>
              <CommandShortcut>⌘U</CommandShortcut>
            </CommandItem>

            <CommandItem
              onSelect={() =>
                handleSelect(() => {
                  requestNewFolder()
                })
              }
              className="cursor-pointer"
            >
              <FolderPlusIcon className="size-4 text-laser-violet" />
              <span>New folder</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>

            <CommandItem
              onSelect={() =>
                handleSelect(() => {
                  toggle()
                })
              }
              className="cursor-pointer"
            >
              <SparklesIcon className="size-4 text-laser-violet" />
              <span>Toggle Silvi AI Assistant</span>
              <CommandShortcut>⌘J</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* Matching Folders */}
          {matchingFolders.length > 0 && (
            <CommandGroup heading="Folders">
              {matchingFolders.map((folder) => (
                <CommandItem
                  key={folder.id}
                  onSelect={() =>
                    handleSelect(() => {
                      router.push(`/dashboard/folder/${folder.id}`)
                    })
                  }
                  className="cursor-pointer"
                >
                  <FolderIcon className="size-4 text-ash-wisp" />
                  <span className="truncate">{folder.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Matching Files */}
          {matchingFiles.length > 0 && (
            <CommandGroup heading="Files">
              {matchingFiles.map((file) => (
                <CommandItem
                  key={file.id}
                  onSelect={() =>
                    handleSelect(() => {
                      router.push(`/dashboard?q=${encodeURIComponent(file.originalName)}`)
                    })
                  }
                  className="cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileTypeIcon mimeType={file.mimeType} className="size-4 shrink-0 text-laser-violet" />
                    <span className="truncate">{file.originalName}</span>
                  </div>
                  <span className="text-[11px] font-mono text-silver-smoke shrink-0">
                    {formatBytes(file.sizeBytes)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* Navigation */}
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => handleSelect(() => router.push("/dashboard"))}
              className="cursor-pointer"
            >
              <HomeIcon className="size-4 text-silver-smoke" />
              <span>Home / My Drive</span>
            </CommandItem>

            <CommandItem
              onSelect={() => handleSelect(() => router.push("/dashboard/starred"))}
              className="cursor-pointer"
            >
              <StarIcon className="size-4 text-silver-smoke" />
              <span>Starred</span>
            </CommandItem>

            <CommandItem
              onSelect={() => handleSelect(() => router.push("/dashboard/recent"))}
              className="cursor-pointer"
            >
              <ClockIcon className="size-4 text-silver-smoke" />
              <span>Recent</span>
            </CommandItem>

            <CommandItem
              onSelect={() => handleSelect(() => router.push("/dashboard/shared"))}
              className="cursor-pointer"
            >
              <UsersIcon className="size-4 text-silver-smoke" />
              <span>Shared with me</span>
            </CommandItem>

            <CommandItem
              onSelect={() => handleSelect(() => router.push("/dashboard/trash"))}
              className="cursor-pointer"
            >
              <Trash2Icon className="size-4 text-silver-smoke" />
              <span>Trash</span>
            </CommandItem>

            <CommandItem
              onSelect={() => handleSelect(() => router.push("/dashboard/settings"))}
              className="cursor-pointer"
            >
              <SettingsIcon className="size-4 text-silver-smoke" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
