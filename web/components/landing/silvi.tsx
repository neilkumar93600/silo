"use client";

import { motion } from "motion/react";
import {
    Search,
    HardDrive,
    FolderTree,
    Share2,
    Star,
    CheckIcon,
    XIcon,
    AlertTriangleIcon,
    type LucideIcon,
} from "lucide-react";
import { SilviOrb } from "@/components/assistant/silvi-orb";

interface Capability {
    icon: LucideIcon;
    title: string;
    description: string;
}

const capabilities: Capability[] = [
    {
        icon: Search,
        title: "Find anything, instantly",
        description: '"Find my Q3 invoices" — Silvi searches by name, type, folder, star status, or date.',
    },
    {
        icon: HardDrive,
        title: "See what's using your storage",
        description: '"What\'s taking up the most space?" — a breakdown by file type and your largest files.',
    },
    {
        icon: FolderTree,
        title: "Organize on command",
        description: '"Move these into a Design folder" — Silvi creates, renames, and nests folders for you.',
    },
    {
        icon: Star,
        title: "Star, restore, clean up",
        description: '"Star my onboarding deck" — or restore something you trashed by mistake.',
    },
    {
        icon: Share2,
        title: "Share, but never without asking",
        description: 'Sharing, deleting, and going public always pause for your confirmation first.',
    },
];

function ChatMockup() {
    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-gray-100 px-4">
                <SilviOrb status="idle" size={28} showGlow={false} />
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-tight text-[#b997ff]">Silvi</span>
                    <span className="rounded-full border border-gray-200 bg-[#e9f6f1] px-2 py-0.5 text-[10px] font-medium text-[#00f575]">
                        Ready
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4">
                {/* User message */}
                <div className="flex justify-end pl-8">
                    <div className="rounded-lg bg-[#b997ff] px-3.5 py-2.5 text-xs text-white leading-relaxed max-w-[85%]">
                        What&apos;s taking up the most space in my drive?
                    </div>
                </div>

                {/* Silvi response */}
                <div className="flex items-start gap-2.5 pr-4">
                    <div className="mt-0.5 shrink-0">
                        <SilviOrb status="idle" size={24} showGlow={false} />
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-[#f9fafb] p-3.5 text-xs leading-relaxed text-[#b997ff] max-w-[85%]">
                        <div className="flex items-start gap-2 my-0.5">
                            <span className="size-1.5 rounded-full bg-[#b997ff] shrink-0 mt-1.5" />
                            <span>812 MB in videos — largest: <span className="font-mono text-[11px]">product-launch.mp4</span></span>
                        </div>
                        <div className="flex items-start gap-2 my-0.5">
                            <span className="size-1.5 rounded-full bg-[#b997ff] shrink-0 mt-1.5" />
                            <span>156 MB in <span className="font-mono text-[11px]">/Team offsite</span></span>
                        </div>
                    </div>
                </div>

                {/* User message 2 */}
                <div className="flex justify-end pl-8">
                    <div className="rounded-lg bg-[#b997ff] px-3.5 py-2.5 text-xs text-white leading-relaxed max-w-[85%]">
                        Share team-offsite.zip with j.rivera@company.com
                    </div>
                </div>

                {/* Confirmation card — matches the real in-app confirm-first flow */}
                <div className="flex flex-col gap-3 rounded-lg border-2 border-[#ff5632]/40 bg-orange-50/40 p-3.5">
                    <div className="flex items-start gap-2.5">
                        <div className="rounded-full bg-[#ff5632]/10 p-1.5 text-[#ff5632] shrink-0 mt-0.5">
                            <AlertTriangleIcon className="size-4" />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <span className="text-xs font-semibold text-[#b997ff]">Action Confirmation Required</span>
                            <p className="text-xs text-[#b997ff]/70 leading-relaxed">
                                Share &ldquo;team-offsite.zip&rdquo; with j.rivera@company.com
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-[#ff5632]/20">
                        <span className="flex h-8 items-center gap-1.5 rounded-lg bg-[#ff5632] px-3 text-xs font-medium text-white">
                            <CheckIcon className="size-3.5" />
                            Confirm Action
                        </span>
                        <span className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs text-[#b997ff]">
                            <XIcon className="size-3.5" />
                            Cancel
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandingSilvi({ className }: { className?: string }) {
    return (
        <section className={"bg-gradient-to-br from-laser-violet via-[#2d2734] to-[#6b13f5] py-24 px-6 md:px-12 font-sans " + (className || "")}>
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: copy + capability list */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.2 }}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1 mb-5"
                        >
                            <SilviOrb status="idle" size={16} showGlow={false} interactive={false} />
                            <span className="text-[11px] font-medium tracking-[0.08em] text-laser-violet uppercase">
                                Meet Silvi
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                            className="text-[36px] md:text-[48px] font-semibold text-gray-900 tracking-tight leading-[1.1] mb-5"
                        >
                            Your drive, managed<br />in plain language.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-[16px] text-gray-500 leading-relaxed max-w-md mb-10"
                        >
                            Silvi is built into every Silo account. Ask it to find, organize,
                            or share your files — it always pauses for your confirmation
                            before anything sensitive happens.
                        </motion.p>

                        <div className="flex flex-col gap-6">
                            {capabilities.map((cap, i) => (
                                <motion.div
                                    key={cap.title}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ amount: 0.1 }}
                                    transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
                                    className="flex gap-4"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white">
                                        <cap.icon className="size-5 text-laser-violet" strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">
                                            {cap.title}
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed mt-0.5">
                                            {cap.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: chat mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.1 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="rounded-[24px] border border-gray-200 bg-white shadow-[0_24px_80px_rgba(185,151,255,0.08)] overflow-hidden"
                    >
                        <ChatMockup />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
