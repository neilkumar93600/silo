"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  DownloadIcon,
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  RotateCcwIcon,
  Music2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { motion } from "motion/react"

import { getDownloadUrl, type FileRecord } from "@/lib/api"
import { formatBytes, formatDate } from "@/lib/format"
import { FileTypeIcon } from "@/components/shared/file-icon"
import { getAudioCoverArt, type AudioMetadata } from "@/lib/audio-metadata"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function AudioPlayer({
  file,
  src,
  metadata,
}: {
  file: FileRecord
  src: string
  metadata: AudioMetadata | null
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLooping, setIsLooping] = useState(false)

  const coverUrl = metadata?.coverUrl
  const songTitle = metadata?.title || file.originalName.replace(/\.[^/.]+$/, "")
  const songArtist = metadata?.artist || "Unknown Artist"
  const songAlbum = metadata?.album

  function togglePlay() {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
  }

  function handleSeek(val: number | readonly number[]) {
    if (!audioRef.current) return
    const newTime = typeof val === "number" ? val : val[0] ?? 0
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  function handleVolume(val: number | readonly number[]) {
    if (!audioRef.current) return
    const newVol = typeof val === "number" ? val : val[0] ?? 0
    setVolume(newVol)
    audioRef.current.volume = newVol
    setIsMuted(newVol === 0)
  }

  function toggleMute() {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume || 1
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  function cycleRate() {
    if (!audioRef.current) return
    const rates = [1, 1.25, 1.5, 2]
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length
    const nextRate = rates[nextIdx]
    setPlaybackRate(nextRate)
    audioRef.current.playbackRate = nextRate
  }

  function toggleLoop() {
    if (!audioRef.current) return
    audioRef.current.loop = !isLooping
    setIsLooping(!isLooping)
  }

  return (
    <div className="flex w-full flex-col items-center gap-5 rounded-2xl border border-lavender-mist/60 bg-carbon-ink p-6 text-paper-white shadow-xl">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => !isLooping && setIsPlaying(false)}
      />

      {/* Album Artwork & Rotating Disc Visual */}
      <div className="relative flex size-44 items-center justify-center overflow-hidden rounded-2xl border border-lavender-mist bg-void-plum shadow-2xl">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={songTitle}
            className={cn(
              "size-full object-cover transition-all duration-700",
              isPlaying && "scale-105"
            )}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-laser-violet">
            <Music2Icon className="size-16 stroke-1 animate-pulse" />
          </div>
        )}

        {/* Live Playing Glow Ring */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 ring-2 ring-laser-violet/60 pointer-events-none rounded-2xl"
          />
        )}
      </div>

      {/* Track Info */}
      <div className="flex w-full flex-col items-center text-center">
        <h4 className="truncate text-base font-semibold text-paper-white max-w-[280px]">
          {songTitle}
        </h4>
        <p className="truncate text-xs text-silver-smoke mt-0.5 max-w-[240px]">
          {songArtist} {songAlbum ? `• ${songAlbum}` : ""}
        </p>
      </div>

      {/* Scrubber Timeline */}
      <div className="flex w-full flex-col gap-1.5 px-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] font-mono text-ash-wisp">
          <span>{formatAudioTime(currentTime)}</span>
          <span>{formatAudioTime(duration)}</span>
        </div>
      </div>

      {/* Primary Audio Controls */}
      <div className="flex w-full items-center justify-between px-2 pt-1">
        <button
          type="button"
          onClick={cycleRate}
          className="rounded-lg px-2 py-1 text-xs font-mono font-medium text-silver-smoke hover:bg-void-plum hover:text-paper-white transition-colors"
          title="Playback speed"
        >
          {playbackRate}x
        </button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            onClick={togglePlay}
            className="size-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,245,117,0.4)]"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon className="size-6 fill-current" /> : <PlayIcon className="size-6 fill-current ml-0.5" />}
          </Button>
        </div>

        <button
          type="button"
          onClick={toggleLoop}
          className={cn(
            "rounded-lg p-2 text-silver-smoke hover:bg-void-plum hover:text-paper-white transition-colors",
            isLooping && "text-laser-violet bg-void-plum"
          )}
          title={isLooping ? "Disable repeat" : "Repeat track"}
        >
          <RotateCcwIcon className="size-4" />
        </button>
      </div>

      {/* Volume Slider */}
      <div className="flex w-full items-center gap-2.5 px-3 pt-1 border-t border-lavender-mist/30">
        <button
          type="button"
          onClick={toggleMute}
          className="text-silver-smoke hover:text-paper-white transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? <VolumeXIcon className="size-4" /> : <Volume2Icon className="size-4" />}
        </button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolume}
          className="w-24 cursor-pointer"
        />
      </div>
    </div>
  )
}

export function FilePreviewDialog({
  file,
  files = [],
  onOpenChange,
  onSelectFile,
}: {
  file: FileRecord | null
  files?: FileRecord[]
  onOpenChange: (open: boolean) => void
  onSelectFile?: (file: FileRecord) => void
}) {
  const [inlineUrl, setInlineUrl] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [audioMeta, setAudioMeta] = useState<AudioMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [textContent, setTextContent] = useState<string | null>(null)

  const currentIndex = file ? files.findIndex((f) => f.id === file.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < files.length - 1

  const isAudio = Boolean(file && (file.mimeType.startsWith("audio/") || /\.(mp3|wav|m4a|flac|ogg|aac|opus|wma)$/i.test(file.originalName)))
  const isImage = Boolean(file && file.mimeType.startsWith("image/"))
  const isVideo = Boolean(file && file.mimeType.startsWith("video/"))
  const isPdf = Boolean(file && (file.mimeType === "application/pdf" || file.originalName.endsWith(".pdf")))
  const isText = Boolean(file && (file.mimeType.startsWith("text/") || file.mimeType === "application/json"))

  const handlePrev = useCallback(() => {
    if (hasPrev && onSelectFile) {
      onSelectFile(files[currentIndex - 1])
    }
  }, [hasPrev, onSelectFile, files, currentIndex])

  const handleNext = useCallback(() => {
    if (hasNext && onSelectFile) {
      onSelectFile(files[currentIndex + 1])
    }
  }, [hasNext, onSelectFile, files, currentIndex])

  // Keyboard navigation for carousel
  useEffect(() => {
    if (!file) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        handlePrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [file, handlePrev, handleNext])

  useEffect(() => {
    if (!file) {
      setInlineUrl(null)
      setDownloadUrl(null)
      setAudioMeta(null)
      setTextContent(null)
      return
    }

    let ignore = false
    setLoading(true)

    // Fetch inline preview URL
    getDownloadUrl(file.id, true)
      .then(async (res) => {
        if (ignore) return
        setInlineUrl(res.url)

        if (isAudio) {
          const meta = await getAudioCoverArt(file.id, res.url)
          if (!ignore && meta) setAudioMeta(meta)
        } else if (isText) {
          try {
            const textRes = await fetch(res.url)
            if (textRes.ok) {
              const text = await textRes.text()
              if (!ignore) setTextContent(text.slice(0, 10000))
            }
          } catch {}
        }
      })
      .catch(() => {
        if (!ignore) setInlineUrl(null)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    // Fetch download attachment URL
    getDownloadUrl(file.id, false)
      .then((res) => {
        if (!ignore) setDownloadUrl(res.url)
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [file, isAudio, isText])

  return (
    <Dialog open={file !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-lavender-mist bg-eclipse-black text-paper-white overflow-hidden p-6">
        {file && (
          <div className="flex flex-col gap-5">
            <DialogHeader>
              <div className="flex items-center justify-between pr-8">
                <DialogTitle className="truncate text-paper-white text-lg font-semibold max-w-sm">
                  {file.originalName}
                </DialogTitle>
                {files.length > 1 && currentIndex >= 0 && (
                  <span className="font-mono text-xs text-ash-wisp">
                    {currentIndex + 1} / {files.length}
                  </span>
                )}
              </div>
              <DialogDescription className="font-mono text-xs text-silver-smoke">
                {formatBytes(file.sizeBytes)} · {formatDate(file.createdAt)}
              </DialogDescription>
            </DialogHeader>

            {/* Media Content with Carousel Prev / Next Overlay Buttons */}
            <div className="relative flex min-h-48 items-center justify-center rounded-xl border border-lavender-mist/60 bg-void-plum p-4 group">
              {hasPrev && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 z-10 flex size-9 items-center justify-center rounded-full bg-carbon-ink/80 text-paper-white shadow-lg backdrop-blur-sm border border-lavender-mist hover:bg-laser-violet transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                  aria-label="Previous file"
                >
                  <ChevronLeftIcon className="size-5" />
                </button>
              )}

              {hasNext && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 z-10 flex size-9 items-center justify-center rounded-full bg-carbon-ink/80 text-paper-white shadow-lg backdrop-blur-sm border border-lavender-mist hover:bg-laser-violet transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                  aria-label="Next file"
                >
                  <ChevronRightIcon className="size-5" />
                </button>
              )}

              {loading ? (
                <Skeleton className="h-48 w-full bg-lavender-mist/40 rounded-xl" />
              ) : isAudio && inlineUrl ? (
                <AudioPlayer file={file} src={inlineUrl} metadata={audioMeta} />
              ) : isImage && inlineUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={inlineUrl}
                  alt={file.originalName}
                  className="max-h-[60vh] w-full rounded-lg object-contain"
                />
              ) : isVideo && inlineUrl ? (
                <video
                  controls
                  autoPlay
                  src={inlineUrl}
                  className="max-h-[60vh] w-full rounded-lg shadow-lg"
                />
              ) : isPdf && inlineUrl ? (
                <iframe
                  src={inlineUrl}
                  title={file.originalName}
                  className="h-96 w-full rounded-lg border border-lavender-mist bg-white"
                />
              ) : isText && textContent !== null ? (
                <pre className="max-h-80 w-full overflow-auto rounded-lg bg-carbon-ink p-4 font-mono text-xs text-silver-smoke">
                  <code>{textContent}</code>
                </pre>
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-silver-smoke">
                  <FileTypeIcon mimeType={file.mimeType} className="size-16 text-laser-violet" />
                  <span className="text-xs">Preview not available for this file type</span>
                </div>
              )}
            </div>

            <Button
              disabled={!downloadUrl}
              className="w-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:shadow-[0_4px_16px_rgba(0,245,117,0.25)] h-10 transition-all cursor-pointer"
              render={<a href={downloadUrl ?? "#"} download={file.originalName} />}
            >
              <DownloadIcon data-icon="inline-start" className="size-4" />
              Download File
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
