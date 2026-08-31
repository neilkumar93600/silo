"use client"

import { useEffect, useState } from "react"
import { UploadCloudIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useDrive } from "@/components/layout/drive-context"

export function GlobalWindowDropzone() {
  const { uploadFiles, activeFolderId } = useDrive()
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    let dragCounter = 0

    function handleDragEnter(e: DragEvent) {
      if (!e.dataTransfer?.types.includes("Files")) return
      e.preventDefault()
      dragCounter++
      setIsDragging(true)
    }

    function handleDragLeave(e: DragEvent) {
      if (!e.dataTransfer?.types.includes("Files")) return
      e.preventDefault()
      dragCounter--
      if (dragCounter <= 0) {
        dragCounter = 0
        setIsDragging(false)
      }
    }

    function handleDragOver(e: DragEvent) {
      if (!e.dataTransfer?.types.includes("Files")) return
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
    }

    function handleDrop(e: DragEvent) {
      if (!e.dataTransfer?.types.includes("Files")) return
      e.preventDefault()
      dragCounter = 0
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files, activeFolderId || "root")
      }
    }

    window.addEventListener("dragenter", handleDragEnter)
    window.addEventListener("dragleave", handleDragLeave)
    window.addEventListener("dragover", handleDragOver)
    window.addEventListener("drop", handleDrop)

    return () => {
      window.removeEventListener("dragenter", handleDragEnter)
      window.removeEventListener("dragleave", handleDragLeave)
      window.removeEventListener("dragover", handleDragOver)
      window.removeEventListener("drop", handleDrop)
    }
  }, [uploadFiles, activeFolderId])

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md pointer-events-none p-8"
        >
          <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-laser-violet/80 bg-eclipse-black/90 p-12 text-center shadow-[0_0_50px_rgba(185,151,255,0.3)] animate-pulse">
            <div className="flex size-20 items-center justify-center rounded-full bg-laser-violet/20 text-laser-violet">
              <UploadCloudIcon className="size-10" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-ink-black tracking-tight">
                Drop files to upload
              </h3>
              <p className="text-xs text-silver-smoke max-w-xs font-mono">
                Files will be uploaded directly to {activeFolderId && activeFolderId !== "root" ? "this folder" : "My Drive"}.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
