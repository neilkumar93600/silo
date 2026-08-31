"use client"

import { use, useEffect, useState } from "react"
import { FileIcon, DownloadIcon } from "lucide-react"

import { getShare, ApiError } from "@/lib/api"
import { formatBytes, formatDate } from "@/lib/format"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SharedFile {
  originalName: string
  mimeType: string
  sizeBytes: number
  createdAt: string
}

export default function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [file, setFile] = useState<SharedFile | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getShare(slug)
      .then((res) => {
        setFile(res.file)
        setDownloadUrl(res.url)
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
        }
      })
  }, [slug])

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-cream-canvas p-6 text-ink-black font-sans">
      <div 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,151,255,0.12),transparent_65%)]"
        aria-hidden="true" 
      />
      <Card className="w-full max-w-sm border border-lavender-mist bg-eclipse-black text-ink-black z-10">
        {notFound ? (
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-ink-black">Link not found</CardTitle>
            <CardDescription className="text-silver-smoke">This file isn&apos;t public or doesn&apos;t exist.</CardDescription>
          </CardHeader>
        ) : !file ? (
          <CardContent className="py-10 text-center font-mono text-xs text-silver-smoke">Loading file metadata…</CardContent>
        ) : (
          <>
            <CardHeader>
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-lavender-mist bg-carbon-ink text-laser-violet">
                  <FileIcon className="size-5" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="truncate text-base font-semibold text-ink-black">{file.originalName}</CardTitle>
                  <CardDescription className="font-mono text-[11px] text-silver-smoke mt-0.5">
                    {formatBytes(file.sizeBytes)} · shared {formatDate(file.createdAt)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,245,117,0.4)]" render={<a href={downloadUrl ?? "#"} />}>
                <DownloadIcon data-icon="inline-start" />
                Download File
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}

