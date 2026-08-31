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
  { mood: "idle", label: "Idle / Ready", desc: "Default resting state with calm ready eyes" },
  { mood: "thinking", label: "Thinking / Scanning", desc: "Horizontal cyan scanning visor slits" },
  { mood: "typing", label: "Typing / Generating", desc: "Active generator state with pulse dots" },
  { mood: "checking", label: "Security Inspection", desc: "Alert shield-focused eyes with audit ring" },
  { mood: "processing", label: "Processing Stream", desc: "High-speed quantum aperture eye" },
  { mood: "success", label: "Success / Done", desc: "Cheerful checkmark eyes with green aura" },
  { mood: "happy", label: "Happy / Approved", desc: "Joyful expression with cheerful curve" },
  { mood: "alert", label: "Alert / Warning", desc: "Cryptographic confirmation required" },
  { mood: "sleepy", label: "Sleepy / Standby", desc: "Low power sleeping standby mode" },
];

export default function BrandShowcasePage() {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(96);
  const [selectedBg, setSelectedBg] = React.useState<string>("cream");
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
    cream: "bg-[#fff8f1] border-[#e3d6c5]",
    white: "bg-[#ffffff] border-[#c0bbb6]",
    charcoal: "bg-[#1d1e1c] border-[#4a4a47]",
    dark: "bg-[#18181b] border-white/20",
  };

  const filteredIcons = ALL_CUSTOM_ICONS.filter((item) => {
    const matchesCategory = iconCategory === "all" || item.category === iconCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fff8f1] text-[#1d1e1c] selection:bg-[#fee3b5] selection:text-[#1d1e1c]">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-24">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fee3b5] border border-[#fa5d00]/30 text-xs font-mono text-[#fa5d00] font-medium shadow-sm">
            <SilviSparkle size={14} />
            <span>Brand System & Design Reference · Getharvest Style</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1d1e1c]">
            Silo Brand, Logo & <br />
            <span className="text-[#fa5d00]">
              Custom Icon Platform
            </span>
          </h1>
          <p className="text-sm md:text-base text-[#615f5c] leading-relaxed">
            Warm cream canvas (<code className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-[#c0bbb6]">#fff8f1</code>), white floating cards, and harvest flame (<code className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-[#c0bbb6]">#fa5d00</code>) accents with custom vector icons and responsive mascot states.
          </p>
        </section>

        {/* 1. Interactive Master Logo Showcase */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3d6c5] pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1d1e1c] flex items-center gap-2.5">
                <Layers className="size-5 text-[#fa5d00]" />
                Master Logo & Mark Variations
              </h2>
              <p className="text-xs text-[#615f5c] mt-0.5">
                High-fidelity asymmetrical cloud geometry (larger left puff) with center frosted glass pin
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 bg-[#ffffff] border border-[#c0bbb6] shadow-sm p-2 rounded-2xl text-xs">
              <div className="flex items-center gap-2">
                <Sliders className="size-3.5 text-[#8e8b87]" />
                <span className="text-[#615f5c]">Size: {logoSize}px</span>
                <input
                  type="range"
                  min="32"
                  max="180"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-24 accent-[#fa5d00] cursor-pointer"
                />
              </div>

              <div className="h-4 w-px bg-[#d9d9d9]" />

              <div className="flex items-center gap-1.5">
                <span className="text-[#615f5c]">Canvas:</span>
                {["cream", "white", "charcoal", "dark"].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBg(bg)}
                    className={`size-5 rounded-full border transition-all ${
                      selectedBg === bg ? "ring-2 ring-[#fa5d00] scale-110" : "opacity-60"
                    } ${
                      bg === "cream"
                        ? "bg-[#fff8f1] border-[#c0bbb6]"
                        : bg === "white"
                        ? "bg-white border-[#c0bbb6]"
                        : bg === "charcoal"
                        ? "bg-[#1d1e1c] border-[#4a4a47]"
                        : "bg-[#18181b] border-white/40"
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
            <div className="rounded-[20px] border border-[#e3d6c5] bg-[#ffffff] p-6 flex flex-col items-center justify-between gap-6 hover:shadow-[0_10px_30px_rgba(250,166,0,0.18)] transition-all group">
              <div className="w-full flex items-center justify-between text-xs text-[#8e8b87]">
                <span className="font-semibold text-[#1d1e1c]">App Icon (Squircle)</span>
                <span className="font-mono text-[10px]">App Icon / Favicon</span>
              </div>

              <div className={`size-48 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[selectedBg]}`}>
                <Logo size={logoSize} withBackground bgType="squircle" />
              </div>

              <div className="w-full flex items-center gap-2 pt-2 border-t border-[#f1f0ec]">
                <button
                  onClick={() => copyToClipboard('<Logo size={48} withBackground bgType="squircle" />', "logo-squircle")}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#fff8f1] hover:bg-[#fee3b5] text-xs font-semibold text-[#1d1e1c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#e3d6c5]"
                >
                  {copiedId === "logo-squircle" ? <Check size={13} className="text-[#fa5d00]" /> : <Copy size={13} />}
                  Copy JSX
                </button>
                <a
                  href="/logo-app.svg"
                  download="silo-app-icon.svg"
                  className="p-2 rounded-xl bg-[#fff8f1] hover:bg-[#fee3b5] text-[#615f5c] hover:text-[#1d1e1c] transition-colors border border-[#e3d6c5]"
                  title="Download SVG"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>

            {/* Card 2: Master Vector Mark */}
            <div className="rounded-[20px] border border-[#e3d6c5] bg-[#ffffff] p-6 flex flex-col items-center justify-between gap-6 hover:shadow-[0_10px_30px_rgba(250,166,0,0.18)] transition-all group">
              <div className="w-full flex items-center justify-between text-xs text-[#8e8b87]">
                <span className="font-semibold text-[#1d1e1c]">Vector Mark</span>
                <span className="font-mono text-[10px]">Transparent Vector</span>
              </div>

              <div className={`size-48 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[selectedBg]}`}>
                <LogoIcon size={logoSize} />
              </div>

              <div className="w-full flex items-center gap-2 pt-2 border-t border-[#f1f0ec]">
                <button
                  onClick={() => copyToClipboard('<LogoIcon size={32} />', "logo-mark")}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#fff8f1] hover:bg-[#fee3b5] text-xs font-semibold text-[#1d1e1c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#e3d6c5]"
                >
                  {copiedId === "logo-mark" ? <Check size={13} className="text-[#fa5d00]" /> : <Copy size={13} />}
                  Copy JSX
                </button>
                <a
                  href="/logo.svg"
                  download="silo-logo.svg"
                  className="p-2 rounded-xl bg-[#fff8f1] hover:bg-[#fee3b5] text-[#615f5c] hover:text-[#1d1e1c] transition-colors border border-[#e3d6c5]"
                  title="Download SVG"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>

            {/* Card 3: Monochrome Tone */}
            <div className="rounded-[20px] border border-[#e3d6c5] bg-[#ffffff] p-6 flex flex-col items-center justify-between gap-6 hover:shadow-[0_10px_30px_rgba(250,166,0,0.18)] transition-all group">
              <div className="w-full flex items-center justify-between text-xs text-[#8e8b87]">
                <span className="font-semibold text-[#1d1e1c]">Monochrome Single-Tone</span>
                <span className="font-mono text-[10px]">Single-Color Use</span>
              </div>

              <div className={`size-48 rounded-2xl flex items-center justify-center border transition-all duration-300 ${bgClasses[selectedBg]}`}>
                <LogoIcon size={logoSize} variant="white" className="text-[#1d1e1c]" />
              </div>

              <div className="w-full flex items-center gap-2 pt-2 border-t border-[#f1f0ec]">
                <button
                  onClick={() => copyToClipboard('<LogoIcon size={32} variant="white" />', "logo-white")}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#fff8f1] hover:bg-[#fee3b5] text-xs font-semibold text-[#1d1e1c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#e3d6c5]"
                >
                  {copiedId === "logo-white" ? <Check size={13} className="text-[#fa5d00]" /> : <Copy size={13} />}
                  Copy JSX
                </button>
                <a
                  href="/logo-white.svg"
                  download="silo-logo-white.svg"
                  className="p-2 rounded-xl bg-[#fff8f1] hover:bg-[#fee3b5] text-[#615f5c] hover:text-[#1d1e1c] transition-colors border border-[#e3d6c5]"
                  title="Download SVG"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>

            {/* Card 4: Header Lockup */}
            <div className="rounded-[20px] border border-[#e3d6c5] bg-[#ffffff] p-6 flex flex-col items-center justify-between gap-6 hover:shadow-[0_10px_30px_rgba(250,166,0,0.18)] transition-all group">
              <div className="w-full flex items-center justify-between text-xs text-[#8e8b87]">
                <span className="font-semibold text-[#1d1e1c]">Logo Lockup</span>
                <span className="font-mono text-[10px]">Navigation & Header</span>
              </div>

              <div className={`size-48 rounded-2xl flex items-center justify-center border p-4 transition-all duration-300 ${bgClasses[selectedBg]}`}>
                <LogoLockup iconSize={Math.min(logoSize, 36)} badge="Zero-Knowledge" />
              </div>

              <div className="w-full flex items-center gap-2 pt-2 border-t border-[#f1f0ec]">
                <button
                  onClick={() => copyToClipboard('<LogoLockup href="/" iconSize={24} badge="Zero-Knowledge" />', "logo-lockup")}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#fff8f1] hover:bg-[#fee3b5] text-xs font-semibold text-[#1d1e1c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#e3d6c5]"
                >
                  {copiedId === "logo-lockup" ? <Check size={13} className="text-[#fa5d00]" /> : <Copy size={13} />}
                  Copy JSX
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Silvi Mascot & AI State Playground */}
        <section className="space-y-8">
          <div className="border-b border-[#e3d6c5] pb-4">
            <h2 className="text-2xl font-bold text-[#1d1e1c] flex items-center gap-2.5">
              <Sparkles className="size-5 text-[#fa5d00]" />
              Silvi AI Mascot & Mood States
            </h2>
            <p className="text-xs text-[#615f5c] mt-0.5">
              Interactive vector avatar with 9 expressive facial modes, dynamic volumetric glows, and status badges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Preview Box */}
            <div className="lg:col-span-5 rounded-[20px] border border-[#e3d6c5] bg-[#ffffff] p-8 flex flex-col items-center justify-center gap-6 shadow-[rgba(250,166,0,0.25)_6px_4px_24px_0px] text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <SilviBadge mood={activeSilviMood} label="Silvi" statusText={activeSilviMood.toUpperCase()} />
              </div>

              <div className="py-6">
                <SilviAvatar size={110} mood={activeSilviMood} glow={true} />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#1d1e1c] capitalize">Silvi · {activeSilviMood}</h3>
                <p className="text-xs text-[#615f5c]">
                  {SILVI_MOODS.find((m) => m.mood === activeSilviMood)?.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full pt-4 border-t border-[#f1f0ec]">
                <button
                  onClick={() => copyToClipboard(`<SilviAvatar size={48} mood="${activeSilviMood}" glow />`, "silvi-code")}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-[#fa5d00] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:brightness-95 transition-all cursor-pointer shadow-sm"
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
                  className={`p-4 rounded-[16px] border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                    activeSilviMood === item.mood
                      ? "bg-[#ffffff] border-[#fa5d00] shadow-[0_4px_16px_rgba(250,93,0,0.18)] ring-1 ring-[#fa5d00]"
                      : "bg-[#ffffff] border-[#e3d6c5] hover:border-[#c0bbb6] hover:bg-[#fff8f1]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <SilviAvatar size={32} mood={item.mood} glow={false} />
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      activeSilviMood === item.mood ? "bg-[#fee3b5] text-[#fa5d00] font-semibold" : "bg-[#f1f0ec] text-[#615f5c]"
                    }`}>
                      {item.mood}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-[#1d1e1c]">{item.label}</span>
                    <span className="text-[10px] text-[#615f5c] line-clamp-1">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Custom Website & Vault Icons Suite */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e3d6c5] pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#1d1e1c] flex items-center gap-2.5">
                <Shield className="size-5 text-[#fa5d00]" />
                Custom Website & Security Icons
              </h2>
              <p className="text-xs text-[#615f5c] mt-0.5">
                Handcrafted SVG icon components designed for zero-knowledge storage, vaults, and permission workflows
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8b87]" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-[#ffffff] border border-[#c0bbb6] text-xs text-[#1d1e1c] placeholder-[#8e8b87] focus:outline-none focus:border-[#fa5d00]"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#ffffff] border border-[#c0bbb6] p-1 rounded-xl text-xs shadow-sm">
                {["all", "vault", "security", "files", "brand"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setIconCategory(cat)}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                      iconCategory === cat ? "bg-[#fa5d00] text-white font-semibold" : "text-[#615f5c] hover:text-[#1d1e1c]"
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
                  className="p-5 rounded-[20px] border border-[#e3d6c5] bg-[#ffffff] hover:border-[#fa5d00] hover:shadow-[0_8px_24px_rgba(250,166,0,0.2)] flex flex-col items-center justify-between gap-4 text-center group cursor-pointer transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="size-12 rounded-2xl bg-[#fff8f1] border border-[#e3d6c5] flex items-center justify-center text-[#fa5d00] group-hover:scale-110 transition-transform">
                    <Comp size={iconPreviewScale} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold block text-[#1d1e1c] group-hover:text-[#fa5d00] transition-colors">
                      {icon.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#8e8b87] block capitalize">
                      {icon.category}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#8e8b87] flex items-center gap-1 group-hover:text-[#1d1e1c]">
                    {isCopied ? (
                      <span className="text-[#fa5d00] flex items-center gap-1 font-semibold">
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
          <div className="border-b border-[#e3d6c5] pb-4">
            <h2 className="text-2xl font-bold text-[#1d1e1c] flex items-center gap-2.5">
              <Share2 className="size-5 text-[#fa5d00]" />
              SEO & Social Share Preview Cards (1200×630)
            </h2>
            <p className="text-xs text-[#615f5c] mt-0.5">
              Live preview of social graph metadata, OpenGraph cards, Twitter cards, and PWA assets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Live Social Share Card Preview */}
            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-[20px] border border-[#e3d6c5] overflow-hidden shadow-[rgba(0,0,0,0.15)_0px_8px_30px] group relative bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/og-image.png"
                  alt="Silo OpenGraph Preview"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#c0bbb6] text-xs font-mono text-[#fa5d00] font-semibold flex items-center gap-1.5 shadow-sm">
                  <span className="size-2 rounded-full bg-[#fa5d00] animate-pulse" />
                  1200 × 630 PNG
                </div>
              </div>
            </div>

            {/* Metadata Inspector Card */}
            <div className="lg:col-span-4 rounded-[20px] border border-[#e3d6c5] bg-[#ffffff] p-6 space-y-5 shadow-[rgba(250,166,0,0.15)_4px_4px_20px_0px]">
              <h3 className="text-sm font-bold text-[#1d1e1c] uppercase tracking-wider text-[#fa5d00]">
                Active SEO Package
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#fff8f1] border border-[#e3d6c5] space-y-1">
                  <span className="text-[#8e8b87] font-mono text-[10px]">OpenGraph Image</span>
                  <p className="text-[#1d1e1c] font-mono truncate">/public/og-image.png</p>
                </div>
                <div className="p-3 rounded-xl bg-[#fff8f1] border border-[#e3d6c5] space-y-1">
                  <span className="text-[#8e8b87] font-mono text-[10px]">Twitter Card</span>
                  <p className="text-[#1d1e1c] font-mono truncate">/public/twitter-image.png</p>
                </div>
                <div className="p-3 rounded-xl bg-[#fff8f1] border border-[#e3d6c5] space-y-1">
                  <span className="text-[#8e8b87] font-mono text-[10px]">PWA Manifest</span>
                  <p className="text-[#1d1e1c] font-mono truncate">/public/site.webmanifest</p>
                </div>
                <div className="p-3 rounded-xl bg-[#fff8f1] border border-[#e3d6c5] space-y-1">
                  <span className="text-[#8e8b87] font-mono text-[10px]">Scalable Favicon</span>
                  <p className="text-[#1d1e1c] font-mono truncate">/public/favicon.svg</p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/og-image.png"
                  download="silo-og-image.png"
                  className="w-full py-3 rounded-2xl bg-[#fa5d00] hover:brightness-95 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-sm"
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
