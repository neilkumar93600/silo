"use client";

import * as React from "react";
import Link from "next/link";
import {
  Logo,
  LogoIcon,
  LogoLockup,
  LogoBadge,
  SilviAvatar,
  SilviIcon,
  SilviBadge,
  SilviSparkle,
  VaultIcon,
  FolderVaultIcon,
  CloudSyncIcon,
  StorageGaugeIcon,
  ZeroKnowledgeKeyIcon,
  ShieldCheckGlowIcon,
  RevocableLinkIcon,
  DirectGrantIcon,
  FingerprintAuthIcon,
  VaultFilePdfIcon,
  VaultFileMediaIcon,
  VaultFileCodeIcon,
  VaultFileZipIcon,
  VaultFileSheetIcon,
  DopplerAsteriskIcon,
  CyberUploadIcon,
  TerminalPromptIcon,
  type SilviMood,
} from "@/components/icons";
import { PublicHeader } from "@/components/marketing/public-header";
import { PublicFooter } from "@/components/marketing/public-footer";
import {
  Check,
  Copy,
  Download,
  Search,
  Sparkles,
  Layers,
  Share2,
  Shield,
  Eye,
  Sliders,
} from "lucide-react";

interface IconItem {
  id: string;
  name: string;
  category: "vault" | "security" | "files" | "brand";
  component: React.ComponentType<{ size?: number; className?: string }>;
  code: string;
}

const ALL_CUSTOM_ICONS: IconItem[] = [
  // Vault & Storage
  { id: "vault", name: "Vault Safe", category: "vault", component: VaultIcon, code: '<VaultIcon size={24} />' },
  { id: "folder-vault", name: "Folder Vault", category: "vault", component: FolderVaultIcon, code: '<FolderVaultIcon size={24} />' },
  { id: "cloud-sync", name: "Cloud Sync", category: "vault", component: CloudSyncIcon, code: '<CloudSyncIcon size={24} />' },
  { id: "storage-gauge", name: "Storage Gauge", category: "vault", component: StorageGaugeIcon, code: '<StorageGaugeIcon size={24} />' },
  // Security
  { id: "zk-key", name: "Zero-Knowledge Key", category: "security", component: ZeroKnowledgeKeyIcon, code: '<ZeroKnowledgeKeyIcon size={24} />' },
  { id: "shield-check", name: "Shield Check Glow", category: "security", component: ShieldCheckGlowIcon, code: '<ShieldCheckGlowIcon size={24} />' },
  { id: "revocable-link", name: "Revocable Link", category: "security", component: RevocableLinkIcon, code: '<RevocableLinkIcon size={24} />' },
  { id: "direct-grant", name: "Direct Grant", category: "security", component: DirectGrantIcon, code: '<DirectGrantIcon size={24} />' },
  { id: "fingerprint", name: "Fingerprint Auth", category: "security", component: FingerprintAuthIcon, code: '<FingerprintAuthIcon size={24} />' },
  // Files
  { id: "file-pdf", name: "Vault PDF", category: "files", component: VaultFilePdfIcon, code: '<VaultFilePdfIcon size={24} />' },
  { id: "file-media", name: "Vault Media", category: "files", component: VaultFileMediaIcon, code: '<VaultFileMediaIcon size={24} />' },
  { id: "file-code", name: "Vault Code", category: "files", component: VaultFileCodeIcon, code: '<VaultFileCodeIcon size={24} />' },
  { id: "file-zip", name: "Vault Zip Archive", category: "files", component: VaultFileZipIcon, code: '<VaultFileZipIcon size={24} />' },
  { id: "file-sheet", name: "Vault Spreadsheet", category: "files", component: VaultFileSheetIcon, code: '<VaultFileSheetIcon size={24} />' },
  // Brand
  { id: "asterisk", name: "Doppler Asterisk", category: "brand", component: DopplerAsteriskIcon, code: '<DopplerAsteriskIcon size={24} />' },
  { id: "cyber-upload", name: "Cyber Upload", category: "brand", component: CyberUploadIcon, code: '<CyberUploadIcon size={24} />' },
  { id: "terminal-prompt", name: "Terminal Prompt", category: "brand", component: TerminalPromptIcon, code: '<TerminalPromptIcon size={24} />' },
];

const SILVI_MOODS: { mood: SilviMood; label: string; desc: string }[] = [
  { mood: "idle", label: "Idle / Ready", desc: "Default resting state with calm blinking eyes" },
  { mood: "thinking", label: "Thinking / Scanning", desc: "Horizontal cyan scanning visor slits" },
  { mood: "typing", label: "Typing / Generating", desc: "Excited wide eyes with green pupil dots" },
  { mood: "checking", label: "Security Inspection", desc: "Alert shield-focused eyes with warning tone" },
  { mood: "processing", label: "Processing Stream", desc: "High-speed quantum aperture eye" },
  { mood: "success", label: "Success / Done", desc: "Cheerful arched eyes with emerald aura" },
  { mood: "happy", label: "Happy / Approved", desc: "Joyful expression with cheerful smile" },
  { mood: "alert", label: "Alert / Warning", desc: "Cryptographic confirmation required" },
  { mood: "sleepy", label: "Sleepy / Standby", desc: "Low power sleeping standby mode" },
];

export default function BrandShowcasePage() {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(96);
  const [selectedBg, setSelectedBg] = React.useState<string>("midnight");
  const [activeSilviMood, setActiveSilviMood] = React.useState<SilviMood>("idle");
  const [iconCategory, setIconCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [iconPreviewScale, setIconPreviewScale] = React.useState<number>(28);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const bgClasses: Record<string, string> = {
    midnight: "bg-[#1c1624] border-white/10",
    black: "bg-[#000000] border-white/15",
    charcoal: "bg-[#18181b] border-white/10",
    light: "bg-[#f8fafc] border-slate-300",
  };

  const filteredIcons = ALL_CUSTOM_ICONS.filter((item) => {
    const matchesCategory = iconCategory === "all" || item.category === iconCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#1c1624] text-[#f1f0ec] selection:bg-[#b997ff] selection:text-black">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-24">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b997ff]/10 border border-[#b997ff]/25 text-xs font-mono text-[#b997ff]">
            <SilviSparkle size={14} />
            <span>Brand System & Interactive Preview Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#f1f0ec]">
            Silo Brand, Logo & <br />
            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
              Custom Icon Platform
            </span>
          </h1>
          <p className="text-sm md:text-base text-[#d0c9c4] leading-relaxed">
            A comprehensive design system featuring the Doppler theme-aligned cloud-pin logo mark, expressive Silvi AI mascot states, custom security glyphs, and high-resolution SEO variations.
          </p>
        </section>

        {/* 1. Interactive Master Logo Showcase */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#f1f0ec] flex items-center gap-2.5">
                <Layers className="size-5 text-[#b997ff]" />
                Master Logo & Mark Variations
              </h2>
              <p className="text-xs text-[#a5a2a5] mt-0.5">
                High-fidelity vector geometry with volumetric frosted glass pin and neon aurora bulbs
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 bg-[#2d2734] border border-white/10 p-2 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Sliders className="size-3.5 text-[#a5a2a5]" />
                <span className="text-[#d0c9c4]">Size: {logoSize}px</span>
                <input
                  type="range"
                  min="32"
                  max="180"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-24 accent-[#b997ff] cursor-pointer"
                />
              </div>

              <div className="h-4 w-px bg-white/15" />

              <div className="flex items-center gap-1.5">
                <span className="text-[#d0c9c4]">Canvas:</span>
                {["midnight", "black", "charcoal", "light"].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBg(bg)}
                    className={`size-5 rounded-full border transition-all ${
                      selectedBg === bg ? "ring-2 ring-[#b997ff] scale-110" : "opacity-60"
                    } ${
                      bg === "midnight"
                        ? "bg-[#1c1624] border-white/20"
                        : bg === "black"
                        ? "bg-black border-white/20"
                        : bg === "charcoal"
                        ? "bg-[#18181b] border-white/20"
                        : "bg-white border-slate-400"
                    }`}
                    title={bg}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Master App Squircle */}
            <div className="rounded-2xl border border-white/10 bg-[#2d2734]/50 p-6 flex flex-col items-center justify-between gap-6 hover:border-[#b997ff]/40 transition-all group">
              <div className="w-full flex items-center justify-between text-xs text-[#a5a2a5]">
                <span className="font-semibold text-[#f1f0ec]">App Icon (Squircle)</span>
                <span className="font-mono text-[10px]">App Icon / Favicon</span>
              </div>

              <div className={`size-48 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[selectedBg]}`}>
                <Logo size={logoSize} withBackground bgType="squircle" />
              </div>

              <div className="w-full flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => copyToClipboard('<Logo size={48} withBackground bgType="squircle" />', "logo-squircle")}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/10 text-xs font-medium text-[#f1f0ec] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === "logo-squircle" ? <Check size={13} className="text-[#00f575]" /> : <Copy size={13} />}
                  Copy JSX
                </button>
                <a
                  href="/logo-app.svg"
                  download="silo-app-icon.svg"
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[#d0c9c4] hover:text-white transition-colors"
                  title="Download SVG"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>

            {/* Card 2: Master Vector Mark */}
            <div className="rounded-2xl border border-white/10 bg-[#2d2734]/50 p-6 flex flex-col items-center justify-between gap-6 hover:border-[#b997ff]/40 transition-all group">
              <div className="w-full flex items-center justify-between text-xs text-[#a5a2a5]">
                <span className="font-semibold text-[#f1f0ec]">Vector Mark</span>
                <span className="font-mono text-[10px]">Transparent Vector</span>
              </div>

              <div className={`size-48 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[selectedBg]}`}>
                <LogoIcon size={logoSize} />
              </div>

              <div className="w-full flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => copyToClipboard('<LogoIcon size={32} />', "logo-mark")}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/10 text-xs font-medium text-[#f1f0ec] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === "logo-mark" ? <Check size={13} className="text-[#00f575]" /> : <Copy size={13} />}
                  Copy JSX
                </button>
                <a
                  href="/logo.svg"
                  download="silo-logo.svg"
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[#d0c9c4] hover:text-white transition-colors"
                  title="Download SVG"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>

            {/* Card 3: Monochrome Bone White */}
            <div className="rounded-2xl border border-white/10 bg-[#2d2734]/50 p-6 flex flex-col items-center justify-between gap-6 hover:border-[#b997ff]/40 transition-all group">
              <div className="w-full flex items-center justify-between text-xs text-[#a5a2a5]">
                <span className="font-semibold text-[#f1f0ec]">Monochrome White</span>
                <span className="font-mono text-[10px]">Single-Color Use</span>
              </div>

              <div className={`size-48 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[selectedBg]}`}>
                <LogoIcon size={logoSize} variant="white" className="text-white" />
              </div>

              <div className="w-full flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => copyToClipboard('<LogoIcon size={32} variant="white" />', "logo-white")}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/10 text-xs font-medium text-[#f1f0ec] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === "logo-white" ? <Check size={13} className="text-[#00f575]" /> : <Copy size={13} />}
                  Copy JSX
                </button>
                <a
                  href="/logo-white.svg"
                  download="silo-logo-white.svg"
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[#d0c9c4] hover:text-white transition-colors"
                  title="Download SVG"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>

            {/* Card 4: Header Lockup */}
            <div className="rounded-2xl border border-white/10 bg-[#2d2734]/50 p-6 flex flex-col items-center justify-between gap-6 hover:border-[#b997ff]/40 transition-all group">
              <div className="w-full flex items-center justify-between text-xs text-[#a5a2a5]">
                <span className="font-semibold text-[#f1f0ec]">Logo Lockup</span>
                <span className="font-mono text-[10px]">Navigation & Header</span>
              </div>

              <div className={`size-48 rounded-2xl flex items-center justify-center border p-4 transition-all duration-300 ${bgClasses[selectedBg]}`}>
                <LogoLockup iconSize={Math.min(logoSize, 36)} badge="ZK-Vault" />
              </div>

              <div className="w-full flex items-center gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => copyToClipboard('<LogoLockup href="/" iconSize={24} badge="Zero-Knowledge" />', "logo-lockup")}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/10 text-xs font-medium text-[#f1f0ec] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === "logo-lockup" ? <Check size={13} className="text-[#00f575]" /> : <Copy size={13} />}
                  Copy JSX
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Silvi Mascot & AI State Playground */}
        <section className="space-y-8">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-[#f1f0ec] flex items-center gap-2.5">
              <Sparkles className="size-5 text-[#00f575]" />
              Silvi AI Mascot & Mood States
            </h2>
            <p className="text-xs text-[#a5a2a5] mt-0.5">
              Interactive vector avatar with 9 expressive facial modes, dynamic volumetric glows, and status badges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Preview Box */}
            <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-gradient-to-b from-[#2d2734] to-[#1c1624] p-8 flex flex-col items-center justify-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <SilviBadge mood={activeSilviMood} label="Silvi" statusText={activeSilviMood.toUpperCase()} />
              </div>

              <div className="py-6">
                <SilviAvatar size={110} mood={activeSilviMood} glow={true} />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#f1f0ec] capitalize">Silvi · {activeSilviMood}</h3>
                <p className="text-xs text-[#a5a2a5]">
                  {SILVI_MOODS.find((m) => m.mood === activeSilviMood)?.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full pt-4 border-t border-white/10">
                <button
                  onClick={() => copyToClipboard(`<SilviAvatar size={48} mood="${activeSilviMood}" glow />`, "silvi-code")}
                  className="flex-1 py-2 px-4 rounded-xl bg-[#b997ff] text-black font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#ff9efa] transition-colors cursor-pointer"
                >
                  {copiedId === "silvi-code" ? <Check size={14} /> : <Copy size={14} />}
                  Copy Mood Component
                </button>
              </div>
            </div>

            {/* Right Mood Selector Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SILVI_MOODS.map((item) => (
                <button
                  key={item.mood}
                  onClick={() => setActiveSilviMood(item.mood)}
                  className={`p-4 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                    activeSilviMood === item.mood
                      ? "bg-[#2d2734] border-[#b997ff] shadow-[0_0_20px_rgba(185,151,255,0.2)]"
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <SilviAvatar size={32} mood={item.mood} glow={false} />
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      activeSilviMood === item.mood ? "bg-[#b997ff]/20 text-[#b997ff]" : "bg-white/5 text-[#a5a2a5]"
                    }`}>
                      {item.mood}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-[#f1f0ec]">{item.label}</span>
                    <span className="text-[10px] text-[#a5a2a5] line-clamp-1">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Custom Website & Vault Icons Suite */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#f1f0ec] flex items-center gap-2.5">
                <Shield className="size-5 text-[#b997ff]" />
                Custom Website & Security Icons
              </h2>
              <p className="text-xs text-[#a5a2a5] mt-0.5">
                Handcrafted SVG icon components designed for zero-knowledge storage, vaults, and permission workflows
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a5a2a5]" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-[#2d2734] border border-white/10 text-xs text-[#f1f0ec] placeholder-[#a5a2a5] focus:outline-none focus:border-[#b997ff]"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#2d2734] border border-white/10 p-1 rounded-xl text-xs">
                {["all", "vault", "security", "files", "brand"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setIconCategory(cat)}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                      iconCategory === cat ? "bg-[#b997ff] text-black font-semibold" : "text-[#d0c9c4] hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Icon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredIcons.map((icon) => {
              const Comp = icon.component;
              const isCopied = copiedId === icon.id;
              return (
                <div
                  key={icon.id}
                  onClick={() => copyToClipboard(icon.code, icon.id)}
                  className="p-5 rounded-2xl border border-white/10 bg-[#2d2734]/40 hover:bg-[#2d2734] hover:border-[#b997ff]/40 flex flex-col items-center justify-between gap-4 text-center group cursor-pointer transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="size-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-[#b997ff] group-hover:text-white group-hover:scale-110 transition-transform">
                    <Comp size={iconPreviewScale} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold block text-[#f1f0ec] group-hover:text-[#b997ff] transition-colors">
                      {icon.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#a5a2a5] block capitalize">
                      {icon.category}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/50 flex items-center gap-1 group-hover:text-white">
                    {isCopied ? (
                      <span className="text-[#00f575] flex items-center gap-1 font-semibold">
                        <Check size={11} /> Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy size={11} /> Copy JSX
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SEO & Social Preview Cards */}
        <section className="space-y-8">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-[#f1f0ec] flex items-center gap-2.5">
              <Share2 className="size-5 text-[#00f575]" />
              SEO & Social Share Preview Cards (1200×630)
            </h2>
            <p className="text-xs text-[#a5a2a5] mt-0.5">
              Live preview of social graph metadata, OpenGraph cards, Twitter cards, and PWA assets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Live Social Share Card Preview */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-3xl border border-white/15 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.7)] group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/og-image.png"
                  alt="Silo OpenGraph Preview"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-[#00f575] flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#00f575] animate-pulse" />
                  1200 × 630 PNG
                </div>
              </div>
            </div>

            {/* Metadata Inspector Card */}
            <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#2d2734]/60 p-6 space-y-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-[#f1f0ec] uppercase tracking-wider text-[#b997ff]">
                Active SEO Package
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                  <span className="text-[#a5a2a5] font-mono text-[10px]">OpenGraph Image</span>
                  <p className="text-[#f1f0ec] font-mono truncate">/public/og-image.png</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                  <span className="text-[#a5a2a5] font-mono text-[10px]">Twitter Card</span>
                  <p className="text-[#f1f0ec] font-mono truncate">/public/twitter-image.png</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                  <span className="text-[#a5a2a5] font-mono text-[10px]">PWA Manifest</span>
                  <p className="text-[#f1f0ec] font-mono truncate">/public/site.webmanifest</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                  <span className="text-[#a5a2a5] font-mono text-[10px]">Scalable Favicon</span>
                  <p className="text-[#f1f0ec] font-mono truncate">/public/favicon.svg</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/og-image.png"
                  download="silo-og-image.png"
                  className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-[#f1f0ec] flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={14} /> Download Social Card
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
