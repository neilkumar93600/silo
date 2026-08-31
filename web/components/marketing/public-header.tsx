"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { PillButton } from "./pill-button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
]

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-lavender-mist bg-cream-canvas/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.025em] text-ink-black">
          <Logo className="h-5 w-auto shrink-0 text-ink-black" />
          <span className="font-freckle text-[21px] tracking-wide">Silo</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1 rounded-full border border-lavender-mist bg-eclipse-black/60 p-1 backdrop-blur-sm">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="block rounded-full px-4 py-1.5 text-[14px] font-medium text-ink-black/75 transition-colors hover:bg-eclipse-black hover:text-ink-black"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:block text-[14px] font-normal text-silver-smoke transition-colors hover:text-laser-violet"
          >
            Sign in
          </Link>
          <PillButton href="/signup" variant="filled" className="px-4 py-1.5 text-[14px]">
            Get started
          </PillButton>
        </nav>
      </div>
    </header>
  )
}
