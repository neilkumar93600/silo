"use client";

import React, { useEffect, useRef } from "react";
import {
    LayoutDashboard,
    FolderRoot,
    Star,
    Share2,
    Trash2,
    Settings,
    HelpCircle,
    Search,
    Bell,
    Sparkles,
    Upload,
    FolderPlus,
    Lock,
    Globe
} from "lucide-react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { Logo } from "@/components/shared/logo";

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <button
            className={"w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all " + (active ? "bg-white/10 text-white font-medium" : "text-white/50 hover:text-white hover:bg-white/5")}
        >
            {icon}
            {label}
        </button>
    );
}

const recentFiles = [
    { name: "brand-guidelines.pdf", size: "4.2 MB", ext: "PDF", visibility: "private" as const },
    { name: "product-launch.mp4", size: "812 MB", ext: "MP4", visibility: "private" as const },
    { name: "team-offsite.zip", size: "156 MB", ext: "ZIP", visibility: "public" as const },
    { name: "q3-invoices.xlsx", size: "1.1 MB", ext: "XLS", visibility: "private" as const },
];

const sharedWithYou = [
    { name: "onboarding-deck.pdf", from: "j.rivera" },
    { name: "design-system.fig", from: "m.chen" },
];

// ============================================================================
// DASHBOARD
// ============================================================================
function Dashboard() {
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.4,
                ease: "easeOut" as const,
                staggerChildren: 0.1,
                delayChildren: 0.6
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full max-w-6xl mx-auto rounded-[40px] overflow-hidden border border-white/15 bg-white/[0.04] backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col md:flex-row text-white/90"
        >
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex-col p-6 hidden lg:flex shrink-0 bg-black/20 backdrop-blur-xl">
                <motion.div variants={itemVariants} className="flex items-center gap-2 mb-10 px-2">
                    <Logo className="h-5 w-auto shrink-0 text-white" />
                    <span className="text-[17px] font-freckle tracking-wide">Silo</span>
                </motion.div>

                <nav className="flex-1 space-y-1">
                    {[
                        { icon: <LayoutDashboard size={18} />, label: "Dashboard", active: true },
                        { icon: <FolderRoot size={18} />, label: "Folders" },
                        { icon: <Star size={18} />, label: "Starred" },
                        { icon: <Share2 size={18} />, label: "Shared with me" },
                        { icon: <Trash2 size={18} />, label: "Trash" },
                    ].map((item, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <SidebarItem icon={item.icon} label={item.label} active={item.active} />
                        </motion.div>
                    ))}
                </nav>

                <motion.div variants={itemVariants} className="pt-6 border-t border-white/10 space-y-1 mt-auto">
                    <SidebarItem icon={<HelpCircle size={18} />} label="Help Center" />
                    <SidebarItem icon={<Settings size={18} />} label="Settings" />
                </motion.div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Nav */}
                <motion.header variants={itemVariants} className="h-16 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search files"
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-white text-black rounded-lg px-3.5 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-white/90 transition-colors"
                        >
                            <Sparkles size={15} />
                            Ask Silvi
                        </motion.button>
                        <button className="text-white/60 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-[#00f575] rounded-full border-2 border-black" />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold">You</p>
                                <p className="text-xs text-white/40">1.4 GB of 5 GB used</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold">
                                Y
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Dashboard Content */}
                <main className="flex-1 p-8 space-y-6">
                    <motion.div variants={itemVariants} className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#f1f0ec]">Your Vault</h1>
                            <p className="text-xs text-[#a5a2a5] mt-0.5">End-to-end encrypted personal file system</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] hover:text-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95">
                                <FolderPlus size={16} className="text-[#b997ff]" />
                                New folder
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-[#00f575] text-black font-semibold rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:bg-[#00f575]/90 transition-all shadow-[0_0_20px_rgba(0,245,117,0.25)] hover:shadow-[0_0_28px_rgba(0,245,117,0.45)] cursor-pointer"
                            >
                                <Upload size={16} />
                                Upload file
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        {/* Left Column — Redesigned High-Tech Vault HUD & Explorer */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Storage Vault HUD Card */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -2 }}
                                className="bg-white/[0.04] border border-white/10 hover:border-[#b997ff]/30 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md relative overflow-hidden group"
                            >
                                <div className="absolute -top-16 -right-16 size-40 bg-[#b997ff]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#b997ff]/20 transition-all duration-500" />
                                
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-[#00f575] animate-pulse" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-[#d0c9c4]">Encrypted Vault Capacity</span>
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[#b997ff]">
                                        Free Tier · 5.0 GB Max
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-[#f1f0ec] tracking-tight">1.4 GB</span>
                                        <span className="text-xs text-[#a5a2a5]">used of 5.0 GB total</span>
                                    </div>
                                    <span className="text-xs font-semibold text-[#00f575] font-mono">28% Occupied · 3.6 GB Available</span>
                                </div>

                                {/* Segmented Progress Bar */}
                                <div className="h-2.5 w-full bg-white/[0.06] rounded-full overflow-hidden p-0.5 flex gap-1">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "16%" }}
                                        transition={{ duration: 0.8, delay: 0.9 }}
                                        className="h-full bg-[#b997ff] rounded-full"
                                        title="Videos: 812 MB"
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "8%" }}
                                        transition={{ duration: 0.8, delay: 1.1 }}
                                        className="h-full bg-[#ff9efa] rounded-full"
                                        title="Archives: 156 MB"
                                    />
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "4%" }}
                                        transition={{ duration: 0.8, delay: 1.3 }}
                                        className="h-full bg-[#00f575] rounded-full"
                                        title="Documents: 4.2 MB"
                                    />
                                </div>

                                {/* Category Tags */}
                                <div className="flex flex-wrap items-center gap-4 mt-3.5 pt-3 border-t border-white/[0.06] text-[11px] text-[#a5a2a5]">
                                    <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#b997ff]" /> Video (812 MB)</span>
                                    <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#ff9efa]" /> Archives (156 MB)</span>
                                    <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#00f575]" /> Documents (4.2 MB)</span>
                                </div>
                            </motion.div>

                            {/* Recent Files Explorer */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -2 }}
                                className="bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-6 flex-1 flex flex-col transition-all duration-300 backdrop-blur-md"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-[#f1f0ec]">Recent Encrypted Files</h3>
                                        <p className="text-[11px] text-[#a5a2a5]">Zero-knowledge client-side encrypted files</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/[0.05] p-1 rounded-lg border border-white/10 text-xs">
                                        <button className="px-2.5 py-1 rounded-md bg-white/10 text-white font-medium cursor-pointer">All ({recentFiles.length})</button>
                                        <button className="px-2.5 py-1 rounded-md text-white/50 hover:text-white transition-colors cursor-pointer">Private (3)</button>
                                        <button className="px-2.5 py-1 rounded-md text-white/50 hover:text-white transition-colors cursor-pointer">Public (1)</button>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col divide-y divide-white/[0.06]">
                                    {recentFiles.map((file, i) => (
                                        <motion.div
                                            key={file.name}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.2 + i * 0.08 }}
                                            className="group flex items-center justify-between py-3.5 px-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className={"flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-mono font-bold border " + (
                                                    file.ext === "MP4" ? "bg-[#b997ff]/10 text-[#b997ff] border-[#b997ff]/30" :
                                                    file.ext === "PDF" ? "bg-[#ff5632]/10 text-[#ff5632] border-[#ff5632]/30" :
                                                    file.ext === "ZIP" ? "bg-[#ff9efa]/10 text-[#ff9efa] border-[#ff9efa]/30" :
                                                    "bg-[#00f575]/10 text-[#00f575] border-[#00f575]/30"
                                                )}>
                                                    {file.ext}
                                                </span>
                                                <div className="min-w-0">
                                                    <span className="truncate text-sm font-medium text-[#f1f0ec] group-hover:text-white transition-colors block">{file.name}</span>
                                                    <span className="text-[11px] text-[#a5a2a5]">{file.size} · Modified today</span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                {file.visibility === "public" ? (
                                                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#ff9efa] bg-[#ff9efa]/10 px-2.5 py-1 rounded-full border border-[#ff9efa]/20">
                                                        <Globe size={11} /> Public Share
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[11px] text-[#d0c9c4] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/10">
                                                        <Lock size={11} className="text-[#00f575]" /> Vault Only
                                                    </span>
                                                )}
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white cursor-pointer" title="Quick Share">
                                                    <Share2 size={13} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Shared with you */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -2 }}
                                className="bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-semibold text-[#f1f0ec]">Shared with you</h3>
                                    <span className="text-[11px] text-[#a5a2a5]">{sharedWithYou.length} files</span>
                                </div>
                                <div className="space-y-3.5">
                                    {sharedWithYou.map((item, i) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.4 + i * 0.1 }}
                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#b997ff]/20 border border-[#b997ff]/30 text-[#b997ff] flex items-center justify-center text-[11px] font-bold shrink-0">
                                                {item.from[0]?.toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-[#f1f0ec] truncate">{item.name}</p>
                                                <p className="text-[11px] text-[#a5a2a5]">Shared by {item.from}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <button className="w-full mt-5 py-2.5 border border-white/10 hover:border-white/25 rounded-xl text-xs font-medium text-[#f1f0ec] hover:bg-white/[0.06] transition-all cursor-pointer hover:-translate-y-0.5">
                                    View all shared
                                </button>
                            </motion.div>

                            {/* Ask Silvi teaser */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -2 }}
                                className="bg-gradient-to-b from-[#b997ff]/10 to-white/[0.02] border border-[#b997ff]/20 hover:border-[#b997ff]/40 rounded-2xl p-6 transition-all duration-300 backdrop-blur-md relative overflow-hidden group"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles size={16} className="text-[#b997ff] animate-pulse" />
                                    <h3 className="font-semibold text-sm text-[#f1f0ec]">Ask Silvi</h3>
                                </div>
                                <p className="text-xs text-[#d0c9c4] leading-relaxed mb-4">
                                    &ldquo;Find my Q3 invoices and prepare a secure sharing link for j.rivera&rdquo;
                                </p>
                                <div className="text-[11px] text-[#00f575] font-mono flex items-center gap-1.5 bg-[#00f575]/10 border border-[#00f575]/20 px-2.5 py-1.5 rounded-lg">
                                    <span className="size-1.5 rounded-full bg-[#00f575]" />
                                    Silvi confirms before performing any sensitive action.
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </motion.div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function LandingHero({ className }: { className?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.6;
        }
    }, []);

    return (
        <section className={"min-h-[110vh] flex flex-col bg-laser-violet relative overflow-hidden " + (className || "")}>
            {/* Video Background */}
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_032550_0386fe58-a20f-497e-bb07-d1266749cc01.mp4" type="video/mp4" />
            </video>

            {/* Overlay — darkens video for text contrast, tinted toward brand navy */}
            <div className="absolute inset-0 bg-laser-violet/40 z-[1]" />
            <div className="absolute inset-0 bg-black/20 z-[1]" />

            {/* Navigation Bar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" as const }}
                >
                    <div className="relative flex items-center justify-between p-[10px] rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                        {/* Left: Logo */}
                        <div className="flex items-center gap-2 pl-3">
                            <Logo className="h-[22px] w-auto text-white" />
                            <span className="text-white text-[19px] font-freckle tracking-wide">Silo</span>
                        </div>

                        {/* Center: Nav Links */}
                        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                            {["Features", "Silvi", "How it works", "FAQ"].map((item) => (
                                <a
                                    key={item}
                                    href={"#" + item.toLowerCase().replace(/\s+/g, "-")}
                                    className="text-[15px] font-medium text-white/70 hover:text-white transition-colors relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full" />
                                </a>
                            ))}
                        </div>

                        {/* Right: Buttons */}
                        <div className="flex items-center gap-3">
                            <a href="/login" className="text-[15px] font-medium text-white/80 hover:text-white transition-all px-4 py-2 rounded-full hover:bg-white/10 cursor-pointer">
                                Log in
                            </a>
                            <a href="/signup" className="rounded-full px-5 py-2 text-[15px] font-semibold bg-[#00f575] text-black hover:bg-[#00f575]/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,245,117,0.35)] cursor-pointer">
                                Get Started
                            </a>
                        </div>
                    </div>
                </motion.nav>
            </div>

            {/* Hero Content */}
            <div className="relative flex-1 flex flex-col items-center text-center px-6 pt-[180px] pb-16 z-10">
                <div className="flex flex-col items-center w-full">

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
                        className="text-center font-semibold text-5xl md:text-6xl lg:text-[64px] leading-[1.1] tracking-[-0.02em] text-[#f1f0ec] max-w-4xl mt-0 mb-4"
                    >
                        Keep what&apos;s yours,<br />
                        <span className="italic bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#ff5632] bg-clip-text text-transparent">share what you choose.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
                        className="text-center text-base md:text-lg text-[#d0c9c4] max-w-[520px] leading-relaxed mb-8"
                    >
                        Silo gives you total control over your private files — zero-knowledge encrypted storage, automated organization, and verifiable permissions.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
                        className="flex flex-col items-center gap-3"
                    >
                        <a
                            href="/signup"
                            className="rounded-full px-8 py-4 text-base font-semibold bg-[#00f575] text-black hover:bg-[#00f575]/90 transition-all shadow-[0_0_30px_rgba(0,245,117,0.4)] hover:shadow-[0_0_45px_rgba(0,245,117,0.6)] hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                        >
                            <span>Get started for free</span>
                            <span className="text-lg">→</span>
                        </a>
                        <span className="text-xs text-[#a5a2a5] flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-[#00f575]" />
                            5 GB encrypted storage free · No credit card required
                        </span>
                    </motion.div>

                    {/* Dashboard */}
                    <div className="mt-12 w-full">
                        <Dashboard />
                    </div>

                </div>
            </div>
        </section>
    );
}
