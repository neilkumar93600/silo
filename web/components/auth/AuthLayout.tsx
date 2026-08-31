"use client";

import Link from "next/link";
import { Logo, VaultIcon, ShieldCheckGlowIcon, SilviSparkle } from "@/components/icons";
import { GSAPShowcase } from "./GSAPShowcase";

interface AuthLayoutProps {
  children: React.ReactNode;
  showcase: React.ReactNode;
}

export function AuthLayout({ children, showcase }: AuthLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-12 bg-cream-canvas text-ink-black lg:h-screen min-h-screen overflow-x-hidden">
      {/* Left Column: Vault Showcase (7 cols on lg screens) */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-6 xl:p-8 2xl:p-10 border-r border-parchment-shadow overflow-hidden bg-white">
        {/* Cinematic Artwork Background */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/auth-artwork.jpg"
            alt="Silo Vault Artwork"
            className="h-full w-full object-cover opacity-10 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/92 to-white/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white" />
        </div>

        {/* Background Grid & Warm Radial Glows */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(250,93,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(250,93,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-80 z-0"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/4 left-1/4 size-80 bg-marigold-glow/60 rounded-full blur-[130px] pointer-events-none z-0"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-1/4 size-72 bg-harvest-flame/8 rounded-full blur-[110px] pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <Logo size={28} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="text-2xl font-freckle tracking-wide text-ink-black">Silo</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-parchment-shadow text-[11px] font-mono text-warm-stone shadow-harvest-sm">
            <span className="size-1.5 rounded-full bg-harvest-flame animate-pulse" />
            <span>Zero-Knowledge Gateway</span>
          </div>
        </div>

        {/* Middle Showcase Content with Auto Flex centering */}
        <div className="relative z-10 w-full max-w-xl mx-auto flex-1 flex flex-col justify-center py-4">
          <GSAPShowcase>{showcase}</GSAPShowcase>
        </div>

        {/* Bottom Trust & Feature Ribbon */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-parchment-shadow text-xs text-driftwood">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <VaultIcon size={14} className="text-harvest-flame" />
              <span className="text-[11px]">Client-Side Keys</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheckGlowIcon size={14} className="text-harvest-flame" />
              <span className="text-[11px]">AES-256-GCM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SilviSparkle size={14} />
              <span className="text-[11px]">Silvi Guarded</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-smoke tracking-widest uppercase">
            Secured Node 01
          </span>
        </div>
      </div>

      {/* Right Column: Auth Form (5 cols on lg screens) */}
      <div className="lg:col-span-5 flex items-center justify-center min-h-screen lg:min-h-0 overflow-y-auto px-6 py-10 sm:px-10 lg:px-12 relative z-10 bg-cream-canvas">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 right-1/4 size-72 bg-marigold-glow/50 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile Logo */}
          <div className="mb-8 flex lg:hidden items-center justify-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
              <Logo size={32} />
              <span className="text-3xl font-freckle tracking-wide text-ink-black">Silo</span>
            </Link>
          </div>

          <div className="card-harvest rounded-[20px] p-6 sm:p-8 animate-fade-in-scale relative overflow-hidden">
            <div className="absolute -top-24 -left-24 size-48 bg-marigold-glow/40 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

