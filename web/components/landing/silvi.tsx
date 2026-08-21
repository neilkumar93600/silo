"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Search,
    HardDrive,
    FolderTree,
    Share2,
    CheckIcon,
    XIcon,
    AlertTriangleIcon,
    Sparkles,
    CheckCircle2,
    FolderCheck,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";
import { SilviOrb, type ExtendedSilviStatus } from "@/components/assistant/silvi-orb";

interface Scenario {
    id: string;
    label: string;
    icon: LucideIcon;
    status: ExtendedSilviStatus;
    statusBadge: string;
    statusBadgeColor: string;
    userQuery: string;
    renderResponse: () => React.ReactNode;
}

const scenarios: Scenario[] = [
    {
        id: "search",
        label: "Instant Query",
        icon: Search,
        status: "thinking",
        statusBadge: "Scanning Vault...",
        statusBadgeColor: "text-[#b997ff] bg-[#b997ff]/10 border-[#b997ff]/30",
        userQuery: "Find my Q3 invoices and tax filings from last quarter",
        renderResponse: () => (
            <div className="space-y-2">
                <p className="text-xs text-[#d0c9c4] leading-relaxed">
                    Found 2 encrypted files matching &ldquo;Q3 invoices&rdquo;:
                </p>
                <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#b997ff]/30 transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00f575]/10 text-[#00f575] border border-[#00f575]/20 font-bold">XLS</span>
                            <span className="text-xs font-medium text-[#f1f0ec]">q3-invoices-final.xlsx</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#a5a2a5]">1.1 MB · Private</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#b997ff]/30 transition-colors">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ff5632]/10 text-[#ff5632] border border-[#ff5632]/20 font-bold">PDF</span>
                            <span className="text-xs font-medium text-[#f1f0ec]">tax-filings-q3.pdf</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#a5a2a5]">3.4 MB · Private</span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "storage",
        label: "Storage Audit",
        icon: HardDrive,
        status: "typing",
        statusBadge: "Generating Analytics...",
        statusBadgeColor: "text-[#ff9efa] bg-[#ff9efa]/10 border-[#ff9efa]/30",
        userQuery: "What's taking up the most space in my vault?",
        renderResponse: () => (
            <div className="space-y-2.5">
                <p className="text-xs text-[#d0c9c4] leading-relaxed">
                    Here is your current storage breakdown across 1.4 GB used:
                </p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#f1f0ec] p-2 rounded-lg bg-white/[0.04] border border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#b997ff]" />
                            <span>Videos & Media</span>
                        </div>
                        <span className="font-mono text-[#b997ff] font-semibold">812 MB (58%)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#f1f0ec] p-2 rounded-lg bg-white/[0.04] border border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[#ff9efa]" />
                            <span>Compressed Archives</span>
                        </div>
                        <span className="font-mono text-[#ff9efa] font-semibold">156 MB (11%)</span>
                    </div>
                </div>
                <div className="text-[11px] text-[#a5a2a5] flex items-center gap-1.5 pt-1">
                    <Sparkles size={12} className="text-[#00f575]" />
                    Tip: 2 duplicate test videos (340 MB) can be safely archived.
                </div>
            </div>
        ),
    },
    {
        id: "guard",
        label: "Safe Confirmation",
        icon: Share2,
        status: "checking",
        statusBadge: "Paused for Confirmation",
        statusBadgeColor: "text-[#ff5632] bg-[#ff5632]/10 border-[#ff5632]/30",
        userQuery: "Make team-offsite.zip public and share with j.rivera@company.com",
        renderResponse: () => (
            <div className="space-y-3">
                <div className="flex flex-col gap-2.5 rounded-xl border border-[#ff5632]/40 bg-[#ff5632]/10 p-3.5">
                    <div className="flex items-start gap-2.5">
                        <div className="rounded-lg bg-[#ff5632]/20 p-1.5 text-[#ff5632] shrink-0 mt-0.5 border border-[#ff5632]/30">
                            <AlertTriangleIcon className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            <span className="text-xs font-semibold text-[#f1f0ec]">Verification Required</span>
                            <p className="text-[11px] text-[#d0c9c4] leading-relaxed">
                                This will change access permissions from <strong className="text-white">Private</strong> to <strong className="text-[#ff9efa]">Public Share</strong> for <code className="text-xs text-[#b997ff]">team-offsite.zip</code>.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-[#ff5632]/20">
                        <button className="flex h-7 items-center gap-1.5 rounded-lg bg-[#ff5632] px-3 text-xs font-semibold text-white hover:bg-[#ff5632]/90 transition-all cursor-pointer">
                            <CheckIcon className="size-3.5" />
                            Approve Action
                        </button>
                        <button className="flex h-7 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 text-xs text-[#d0c9c4] hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                            <XIcon className="size-3.5" />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "organize",
        label: "Auto-Organize",
        icon: FolderTree,
        status: "success",
        statusBadge: "Vault Cleaned & Organized",
        statusBadgeColor: "text-[#00f575] bg-[#00f575]/10 border-[#00f575]/30",
        userQuery: "Move all Figma exports and design tokens into a /Design System folder",
        renderResponse: () => (
            <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#00f575]/10 border border-[#00f575]/30 flex items-start gap-2.5">
                    <div className="p-1 rounded-lg bg-[#00f575]/20 text-[#00f575] shrink-0 mt-0.5">
                        <FolderCheck className="size-4" />
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-[#f1f0ec]">Organized 5 files into /Design System</span>
                        <p className="text-[11px] text-[#d0c9c4] mt-0.5">
                            Created folder hierarchy and updated cryptographic indexes with zero data re-upload.
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
];

export default function LandingSilvi({ className }: { className?: string }) {
    const [selectedScenario, setSelectedScenario] = useState<string>("guard");
    const activeScenario = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];

    return (
        <section id="silvi" className={"bg-[#1c1624] py-28 px-6 md:px-12 relative overflow-hidden " + (className || "")}>
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -left-40 size-96 bg-[#b997ff]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 -right-40 size-96 bg-[#00f575]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Column: Heading, Info & Interactive Scenario Switcher */}
                    <div className="lg:col-span-6 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            className="inline-flex items-center gap-2 rounded-full border border-[#b997ff]/30 bg-[#b997ff]/10 px-3.5 py-1 mb-5 w-fit"
                        >
                            <SilviOrb status={activeScenario.status} size={16} showGlow={false} interactive={false} />
                            <span className="text-xs font-semibold tracking-wider text-[#b997ff] uppercase">
                                Reactive Vault Assistant
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                            className="text-4xl md:text-5xl font-bold text-[#f1f0ec] tracking-tight leading-[1.15] mb-5"
                        >
                            Your vault, managed <br />
                            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
                                in plain language.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-base text-[#d0c9c4] leading-relaxed max-w-xl mb-8"
                        >
                            Silvi is Doppler&apos;s ambient vault intelligence. It morphs its behavior dynamically across searching, analyzing storage, and guarding permissions — never executing a sensitive action without your explicit cryptographic confirmation.
                        </motion.p>

                        {/* Interactive Scenario Buttons */}
                        <div className="space-y-2.5">
                            <p className="text-xs uppercase tracking-wider font-semibold text-[#a5a2a5] mb-2">
                                Test Interactive Silvi States:
                            </p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {scenarios.map((scenario) => {
                                    const isSelected = scenario.id === activeScenario.id;
                                    const Icon = scenario.icon;
                                    return (
                                        <button
                                            key={scenario.id}
                                            onClick={() => setSelectedScenario(scenario.id)}
                                            className={"flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer hover:-translate-y-0.5 " + (
                                                isSelected
                                                    ? "bg-[#2d2734] border-[#b997ff] shadow-[0_0_20px_rgba(185,151,255,0.25)] text-white"
                                                    : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06] text-[#d0c9c4]"
                                            )}
                                        >
                                            <div className={"size-8 rounded-lg flex items-center justify-center shrink-0 " + (
                                                isSelected ? "bg-[#b997ff]/20 text-[#b997ff]" : "bg-white/[0.06] text-[#a5a2a5]"
                                            )}>
                                                <Icon size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-xs font-semibold block text-[#f1f0ec]">{scenario.label}</span>
                                                <span className="text-[10px] text-[#a5a2a5] truncate block">{scenario.status}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Animated Silvi Console & Chat Flow */}
                    <div className="lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                            className="rounded-3xl border border-white/15 bg-[#2d2734]/50 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden"
                        >
                            {/* Vault Console Header */}
                            <div className="flex h-16 items-center justify-between border-b border-white/10 px-6 bg-white/[0.02]">
                                <div className="flex items-center gap-3.5">
                                    <SilviOrb status={activeScenario.status} size={42} showGlow={true} showRings={true} interactive={true} />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-[#f1f0ec]">Silvi Vault Agent</span>
                                            <span className={"text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border " + activeScenario.statusBadgeColor}>
                                                {activeScenario.statusBadge}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-[#a5a2a5]">Real-time encrypted session</span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-[#00f575] flex items-center gap-1.5 bg-[#00f575]/10 border border-[#00f575]/20 px-2.5 py-1 rounded-full">
                                    <span className="size-1.5 rounded-full bg-[#00f575] animate-pulse" />
                                    Active
                                </span>
                            </div>

                            {/* Chat Conversation Body */}
                            <div className="p-6 space-y-5 min-h-[340px] flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeScenario.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.25 }}
                                        className="space-y-4"
                                    >
                                        {/* User Bubble */}
                                        <div className="flex justify-end pl-8">
                                            <div className="rounded-2xl rounded-tr-sm bg-[#b997ff]/20 border border-[#b997ff]/30 px-4 py-3 text-xs text-[#f1f0ec] leading-relaxed max-w-[90%] shadow-[0_4px_16px_rgba(185,151,255,0.1)]">
                                                {activeScenario.userQuery}
                                            </div>
                                        </div>

                                        {/* Assistant Response with Dynamic Orb State */}
                                        <div className="flex items-start gap-3 pr-4">
                                            <div className="mt-1 shrink-0">
                                                <SilviOrb status={activeScenario.status} size={28} showGlow={false} interactive={false} />
                                            </div>
                                            <div className="flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] p-4 text-xs leading-relaxed max-w-[92%] backdrop-blur-md">
                                                {activeScenario.renderResponse()}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Console Input Bar */}
                            <div className="p-4 border-t border-white/10 bg-white/[0.01] flex items-center gap-3">
                                <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#a5a2a5] flex items-center justify-between">
                                    <span>Ask Silvi to find, organize, or protect files...</span>
                                    <span className="font-mono text-[10px] text-white/40">⌘ + J</span>
                                </div>
                                <button className="size-8 rounded-lg bg-[#00f575] text-black flex items-center justify-center hover:bg-[#00f575]/90 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,245,117,0.3)]">
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

