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
            className="w-full max-w-6xl mx-auto rounded-[40px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row text-white/90"
        >
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex-col p-6 hidden lg:flex shrink-0">
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
                        <h1 className="text-2xl font-bold">Your files</h1>
                        <div className="flex items-center gap-3">
                            <button className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                                <FolderPlus size={16} className="text-white/60" />
                                New folder
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-black rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-white/90 transition-colors"
                            >
                                <Upload size={16} />
                                Upload
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                        {/* Left Column */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Storage Card */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-colors hover:bg-white/[0.07]"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white/60 text-sm font-medium">Storage</h3>
                                    <span className="text-xs text-white/40">Free plan</span>
                                </div>
                                <div className="flex items-end gap-3 mb-4">
                                    <span className="text-3xl font-bold">1.4 GB</span>
                                    <span className="text-xs text-white/40 mb-1">of 5 GB used, no card required</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "28%" }}
                                        transition={{ duration: 1, delay: 1 }}
                                        className="h-full bg-[#00f575] rounded-full"
                                    />
                                </div>
                            </motion.div>

                            {/* Recent Files */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 flex flex-col transition-colors hover:bg-white/[0.07]"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Recent files</h3>
                                    <span className="text-[11px] text-white/40 font-mono">{recentFiles.length} items</span>
                                </div>
                                <div className="flex-1 flex flex-col divide-y divide-white/5">
                                    {recentFiles.map((file, i) => (
                                        <motion.div
                                            key={file.name}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.2 + i * 0.08 }}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex size-7 shrink-0 items-center justify-center rounded bg-white/10 text-[10px] font-mono font-bold">
                                                    {file.ext}
                                                </span>
                                                <span className="truncate text-sm font-medium">{file.name}</span>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3">
                                                <span className="font-mono text-xs text-white/40">{file.size}</span>
                                                {file.visibility === "public" ? (
                                                    <span className="flex items-center gap-1 text-[11px] text-[#ff9efa]">
                                                        <Globe size={11} /> Public
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[11px] text-white/40">
                                                        <Lock size={11} /> Private
                                                    </span>
                                                )}
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
                                whileHover={{ y: -4 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-colors hover:bg-white/[0.07]"
                            >
                                <h3 className="font-semibold mb-5">Shared with you</h3>
                                <div className="space-y-4">
                                    {sharedWithYou.map((item, i) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.4 + i * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[11px] font-semibold shrink-0">
                                                {item.from[0]?.toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-[11px] text-white/40">from {item.from}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <button className="w-full mt-5 py-2 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors">
                                    View all shared
                                </button>
                            </motion.div>

                            {/* Ask Silvi teaser */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-colors hover:bg-white/[0.07]"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles size={16} className="text-[#ff9efa]" />
                                    <h3 className="font-semibold text-sm">Ask Silvi</h3>
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed mb-4">
                                    &ldquo;Find my Q3 invoices and share them with j.rivera&rdquo;
                                </p>
                                <div className="text-[11px] text-white/40 font-mono">
                                    Silvi confirms before anything sensitive.
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
                    <div className="relative flex items-center justify-between p-[10px] rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
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
                            <a href="/login" className="text-[15px] font-medium text-white/70 hover:text-white transition-colors px-3 py-2">
                                Log in
                            </a>
                            <a href="/signup" className="rounded-full px-5 py-2 text-[15px] font-semibold bg-white text-laser-violet hover:bg-white/90 transition-all hover:scale-105 active:scale-95">
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
                        className="text-center font-semibold text-5xl md:text-6xl lg:text-[62px] leading-[1.1] tracking-[-0.02em] text-white max-w-4xl mt-0 mb-4"
                    >
                        Keep what&apos;s yours,<br />
                        <span className="italic">share what you choose.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
                        className="text-center text-base md:text-lg text-white/80 max-w-[480px] leading-relaxed mb-8"
                    >
                        Silo gives you full control over your private files — upload, organize into
                        folders, and share exactly the way you choose.
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
                            className="rounded-full px-8 py-4 text-base font-semibold bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all shadow-2xl hover:scale-105 active:scale-95"
                            style={{ boxShadow: "0 8px 32px 0 rgba(185, 151, 255, 0.37)" }}
                        >
                            Get started for free
                        </a>
                        <span className="text-sm text-white/60">
                            5 GB free, no credit card required
                        </span>
                    </motion.div>

                    {/* Dashboard */}
                    <div className="mt-10 w-full">
                        <Dashboard />
                    </div>

                </div>
            </div>
        </section>
    );
}
