"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

const SHOWCASE_SLIDES = [
  {
    title: "Zero-Knowledge Encryption",
    subtitle: "Client-side encrypted file vaults with isolated key scopes.",
    tag: "Cosmos Storage",
  },
  {
    title: "High-Speed Link Sharing",
    subtitle: "Generate unguessable public share slugs with instant download speeds.",
    tag: "Decentralized Access",
  },
  {
    title: "End-to-End Vault Privacy",
    subtitle: "Your media & documents remain sealed until explicit access is granted.",
    tag: "End-to-End Vault",
  },
]


export function AuthPanel() {
  const [slideIndex, setSlideIndex] = useState(0)

  const currentSlide = SHOWCASE_SLIDES[slideIndex]

  function nextSlide() {
    setSlideIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length)
  }

  function prevSlide() {
    setSlideIndex((prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length)
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-cream-canvas p-6 sm:p-8 text-ink-black select-none">
      {/* Background Image Artwork */}
      <Image
        src="/auth-artwork.jpg"
        alt="Silo Cosmic Artwork"
        fill
        priority
        className="object-cover object-center transition-transform duration-700 hover:scale-105"
      />

      {/* Dark Ambient Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void-plum/80 via-void-plum/30 to-void-plum/90" />

      {/* Top Header Overlay */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-ink-black">
          <span className="flex size-7 items-center justify-center rounded-lg bg-laser-violet text-xs font-bold text-white">
            S
          </span>
          <span>SILO VAULT</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-lavender-mist bg-eclipse-black/80 px-4 py-1.5 font-mono text-[11px] text-ink-black backdrop-blur-md transition-all hover:border-laser-violet hover:text-laser-violet"
          >
            Explore
          </Link>
        </div>
      </div>

      {/* Bottom Overlay Content */}
      <div className="relative z-10 mt-auto flex items-end justify-between gap-4">
        {/* Creator / Feature Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-laser-violet p-[2px] shadow-[0_0_20px_rgba(185,151,255,0.4)]">
            <div className="flex size-full items-center justify-center rounded-full bg-eclipse-black font-mono text-sm font-bold text-laser-violet">
              S
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-black tracking-tight">{currentSlide.title}</p>
            <p className="truncate font-mono text-[11px] text-silver-smoke">{currentSlide.subtitle}</p>
          </div>
        </div>

        {/* Carousel Slide Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex size-9 items-center justify-center rounded-full border border-lavender-mist bg-eclipse-black/90 text-ink-black backdrop-blur-md transition-all hover:border-laser-violet hover:text-laser-violet active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeftIcon className="size-4.5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex size-9 items-center justify-center rounded-full border border-lavender-mist bg-eclipse-black/90 text-ink-black backdrop-blur-md transition-all hover:border-laser-violet hover:text-laser-violet active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowRightIcon className="size-4.5" />
          </button>
        </div>
      </div>
    </div>
  )
}





