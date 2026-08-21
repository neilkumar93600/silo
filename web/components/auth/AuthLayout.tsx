"use client";

import Link from "next/link";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { GSAPShowcase } from "./GSAPShowcase";

interface AuthLayoutProps {
  children: React.ReactNode;
  showcase: React.ReactNode;
}

export function AuthLayout({ children, showcase }: AuthLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-12 bg-[#1c1624] text-[#f1f0ec] lg:h-screen min-h-screen overflow-x-hidden">
      {/* Left Column: Cyber-Vault Showcase HUD (7 cols on lg screens) */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-6 xl:p-8 2xl:p-10 border-r border-white/10 overflow-hidden bg-[#1c1624]">
        {/* Cinematic Artwork Background with Doppler Grade */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/auth-artwork.jpg"
            alt="Silo Vault Artwork"
            className="h-full w-full object-cover opacity-30 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1624] via-[#1c1624]/90 to-[#1c1624]/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1624] via-transparent to-[#1c1624]" />
        </div>

        {/* Background Cyber Grid & Radial Glows */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(185,151,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(185,151,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-80 z-0"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/4 left-1/4 size-80 bg-[#b997ff]/10 rounded-full blur-[130px] pointer-events-none z-0"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-1/4 size-72 bg-[#00f575]/8 rounded-full blur-[110px] pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <Logo className="h-7 w-auto text-white transition-transform duration-300 group-hover:scale-110" />
            <span className="text-2xl font-freckle tracking-wide text-white">Silo</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-[#d0c9c4]">
            <span className="size-1.5 rounded-full bg-[#00f575] shadow-[0_0_8px_#00f575] animate-pulse" />
            <span>Zero-Knowledge Gateway</span>
          </div>
        </div>

        {/* Middle Showcase Content with Auto Flex centering */}
        <div className="relative z-10 w-full max-w-xl mx-auto flex-1 flex flex-col justify-center py-4">
          <GSAPShowcase>{showcase}</GSAPShowcase>
        </div>

        {/* Bottom Trust & Feature Ribbon */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs text-[#a5a2a5]">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-[#00f575]" />
              <span className="text-[11px]">Client-Side Keys</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#b997ff]" />
              <span className="text-[11px]">AES-256-GCM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-[#ff9efa]" />
              <span className="text-[11px]">Silvi Guarded</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-white/35 tracking-widest uppercase">
            Secured Node 01
          </span>
        </div>
      </div>

      {/* Right Column: Auth Form (5 cols on lg screens) */}
      <div className="lg:col-span-5 flex items-center justify-center min-h-screen lg:min-h-0 overflow-y-auto px-6 py-10 sm:px-10 lg:px-12 relative z-10 bg-[#1c1624]">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 right-1/4 size-72 bg-[#b997ff]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile Logo */}
          <div className="mb-8 flex lg:hidden items-center justify-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
              <Logo className="h-8 w-auto text-white" />
              <span className="text-3xl font-freckle tracking-wide text-white">Silo</span>
            </Link>
          </div>

          <div className="bg-[#2d2734]/70 backdrop-blur-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] rounded-3xl p-6 sm:p-8 animate-fade-in-scale relative overflow-hidden">
            <div className="absolute -top-24 -left-24 size-48 bg-[#b997ff]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

