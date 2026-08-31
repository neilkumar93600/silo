"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";
import { UploadCloud, FolderTree, Link2, CheckCircle2, Search, Sparkles, TrendingUp, Compass, FolderPlus, Share2, Wand2, ArrowRight } from "lucide-react";

interface StepData {
    id: string;
    tabLabel: string;
    tabIcon: React.ReactNode;
    badge: string;
    heading: string;
    description: string;
    mockupType: "upload" | "organize" | "share" | "assistant";
}

const steps: StepData[] = [
    {
        id: "step-1",
        tabLabel: "1. Direct Upload",
        tabIcon: <Compass className="w-5 h-5" />,
        badge: "STEP 01: STREAMING UPLOAD",
        heading: "Drop files in, they stream straight to cloud storage.",
        description: "Drag files anywhere on the page. Uploads stream browser-to-vault with live chunk progress — zero file size bottlenecks and instant cryptographic indexing.",
        mockupType: "upload",
    },
    {
        id: "step-2",
        tabLabel: "2. Visual Trees",
        tabIcon: <FolderPlus className="w-5 h-5" />,
        badge: "STEP 02: ORGANIZE",
        heading: "Nest folders as deep as you need.",
        description: "Create folders, nest them with sub-structures, and drag-and-drop files seamlessly. Your drive stays neat with instant client-side directory management.",
        mockupType: "organize",
    },
    {
        id: "step-3",
        tabLabel: "3. Granular Share",
        tabIcon: <Share2 className="w-5 h-5" />,
        badge: "STEP 03: VERIFIED SHARING",
        heading: "Control exactly who sees your data.",
        description: "Keep files strictly private, generate single-purpose unguessable links, or grant user-specific cryptographic access. Revocable anytime with zero trace.",
        mockupType: "share",
    },
    {
        id: "step-4",
        tabLabel: "4. Ask Silvi",
        tabIcon: <Wand2 className="w-5 h-5" />,
        badge: "STEP 04: SILVI INTELLIGENCE",
        heading: "Manage your whole vault in plain language.",
        description: "Ask Silvi to search, organize, or prepare shares. Sensitive actions always pause for your confirmation first — complete safety by design.",
        mockupType: "assistant",
    },
];

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

const staggerVisible: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

function UploadMockup() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/[0.04] p-3.5 rounded-xl border border-parchment-shadow shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-[#b997ff]/20 border border-[#b997ff]/30 flex items-center justify-center text-[#b997ff]">
                        <UploadCloud className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#f1f0ec]">Streaming Direct to Vault</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#00f575]/10 border border-[#00f575]/20 px-2 py-0.5 rounded-full">
                    <div className="size-1.5 rounded-full bg-[#00f575] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-[#00f575]">ACTIVE</span>
                </div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerVisible}
                className="grid grid-cols-1 gap-2.5"
            >
                {[
                    { name: "product-launch.mp4", size: "812 MB", status: "72% transferred", color: "text-[#b997ff]" },
                    { name: "team-offsite.zip", size: "156 MB", status: "Completed", color: "text-[#00f575]" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        variants={rowVariants}
                        className="bg-white/[0.03] p-3.5 rounded-xl border border-parchment-shadow shadow-sm flex items-center justify-between hover:border-parchment-shadow transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg bg-[#2d2734] border border-parchment-shadow flex items-center justify-center text-[#f1f0ec] font-bold text-xs">
                                {item.name.split(".").pop()?.toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-xs text-[#f1f0ec]">{item.name}</p>
                                <p className="text-[10px] text-[#a5a2a5]">{item.size}</p>
                            </div>
                        </div>
                        <div className="bg-white/[0.05] px-2.5 py-1 rounded-full border border-parchment-shadow">
                            <span className={"text-xs font-mono font-semibold " + item.color}>{item.status}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

const shareLineVariants: Variants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 },
};

const shareStagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

function ShareMockup() {
    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.04] rounded-2xl border border-parchment-shadow shadow-sm overflow-hidden"
            >
                <div className="bg-white/[0.03] px-4 py-2.5 border-b border-parchment-shadow flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#a5a2a5] uppercase tracking-wider">Access Permissions</span>
                    <Link2 className="w-3.5 h-3.5 text-[#b997ff]" />
                </div>
                <div className="p-4 space-y-3">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={shareStagger}
                        className="space-y-2.5"
                    >
                        {[
                            { label: "Public share link", state: "Disabled", color: "text-[#a5a2a5]" },
                            { label: "j.rivera@company.com", state: "Access Granted", color: "text-[#00f575]" },
                        ].map((row) => (
                            <motion.div key={row.label} variants={shareLineVariants} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
                                <span className="text-xs text-[#f1f0ec]">{row.label}</span>
                                <span className={"text-[10px] font-mono font-semibold bg-white/[0.04] px-2 py-0.5 rounded-full border border-parchment-shadow " + row.color}>{row.state}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-parchment-shadow"
            >
                <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-[#b997ff]/20 text-[#b997ff] flex items-center justify-center">
                        <Link2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-[#f1f0ec]">Encrypted token key ready</span>
                </div>
                <div className="px-3 py-1 bg-[#00f575] text-black rounded-lg text-xs font-semibold shadow-sm cursor-pointer hover:bg-[#00f575]/90 transition-all">
                    Copy Link
                </div>
            </motion.div>
        </div>
    );
}

function OrganizeMockup() {
    return (
        <div className="space-y-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerVisible}
                className="grid grid-cols-2 gap-3"
            >
                {[
                    { icon: <FolderTree />, value: "18", label: "Encrypted Folders", color: "text-[#b997ff]" },
                    { icon: <TrendingUp />, value: "247", label: "Files Indexed", color: "text-[#00f575]" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={rowVariants}
                        className="bg-white/[0.04] p-4 rounded-xl border border-parchment-shadow"
                    >
                        <div className={"size-8 rounded-lg flex items-center justify-center mb-2 bg-white/[0.05] " + stat.color}>
                            {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
                        </div>
                        <p className="text-2xl font-bold text-[#f1f0ec]">{stat.value}</p>
                        <p className="text-[10px] font-semibold text-[#a5a2a5] uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-[#2d2734] border border-[#b997ff]/30 p-4 rounded-xl text-[#f1f0ec] shadow-lg"
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="size-2 rounded-full bg-[#b997ff]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#b997ff]">Hierarchical Tree</span>
                </div>
                <p className="text-xs text-[#d0c9c4] leading-relaxed font-mono">
                    /Design &gt; /2026 &gt; /Tokens — 3 nested tiers, updated instant locally.
                </p>
            </motion.div>
        </div>
    );
}

function AssistantMockup() {
    return (
        <div className="space-y-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerVisible}
                className="flex items-center justify-around py-3 relative bg-white/[0.03] rounded-xl border border-parchment-shadow"
            >
                {[
                    { icon: <Search />, active: true, label: "Search" },
                    { icon: <Sparkles />, active: true, label: "Analyze" },
                    { icon: <CheckCircle2 />, active: true, label: "Guard" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        className={"size-9 rounded-xl flex items-center justify-center border transition-all " + (item.active ? "bg-[#b997ff]/20 border-[#b997ff]/40 text-[#b997ff]" : "bg-white/[0.04] border-parchment-shadow text-[#a5a2a5]")}
                    >
                        {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#2d2734] p-4 rounded-xl border border-parchment-shadow space-y-2"
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f1f0ec]">Silvi Guardian Protocol</span>
                    <span className="text-[10px] font-mono text-[#00f575] bg-[#00f575]/10 px-2 py-0.5 rounded-full border border-[#00f575]/20">Verified</span>
                </div>
                <p className="text-xs text-[#d0c9c4] leading-relaxed">
                    &ldquo;Share team-offsite.zip with j.rivera?&rdquo; — Pauses and prompts for explicit approval before any changes occur.
                </p>
            </motion.div>
        </div>
    );
}

export default function LandingHowItWorks({ className }: { className?: string }) {
    const [activeTab, setActiveTab] = useState(0);

    const renderMockup = () => {
        switch (steps[activeTab].mockupType) {
            case "upload": return <UploadMockup />;
            case "organize": return <OrganizeMockup />;
            case "share": return <ShareMockup />;
            case "assistant": return <AssistantMockup />;
            default: return null;
        }
    };

    return (
        <section
            id="how-it-works"
            className={"bg-[#1c1624] py-28 px-6 md:px-20 font-sans overflow-hidden border-t border-white/[0.06] " + (className || "")}
        >
            <div className="max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-bold text-4xl md:text-5xl text-[#f1f0ec] leading-tight mb-4 tracking-tight">
                        From upload to shared, <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
                            in four clean steps
                        </span>
                    </h2>
                    <p className="text-base text-[#d0c9c4] max-w-[520px] mx-auto leading-relaxed">
                        No complexity or opaque settings — this is how Silo keeps your workflow fast, seamless, and private.
                    </p>
                </motion.div>

                {/* Steps Header Nav */}
                <div className="bg-[#2d2734]/60 backdrop-blur-2xl rounded-t-[28px] flex flex-row overflow-x-auto no-scrollbar border-x border-t border-parchment-shadow p-2.5 gap-2 shadow-lg">
                    {steps.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setActiveTab(index)}
                            className={"flex-1 min-w-[180px] md:min-w-0 py-3.5 px-5 flex items-center justify-center gap-3 transition-all duration-300 relative rounded-2xl outline-none border cursor-pointer hover:-translate-y-0.5 " + (
                                activeTab === index
                                    ? "bg-white/[0.08] border-[#b997ff]/40 text-[#f1f0ec] shadow-[0_0_20px_rgba(185,151,255,0.15)]"
                                    : "border-transparent text-[#a5a2a5] hover:text-white hover:bg-white/[0.04]"
                            )}
                        >
                            <div className={"size-8 rounded-xl flex items-center justify-center transition-all " + (
                                activeTab === index
                                    ? "bg-[#b997ff] text-black shadow-md"
                                    : "bg-white/[0.06] text-[#a5a2a5]"
                            )}>
                                {step.tabIcon}
                            </div>
                            <span className={"text-xs tracking-tight whitespace-nowrap " + (activeTab === index ? "font-bold text-[#f1f0ec]" : "font-medium")}>
                                {step.tabLabel}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Step Body Content */}
                <div className="bg-[#2d2734]/40 backdrop-blur-3xl rounded-b-[28px] border-x border-b border-parchment-shadow min-h-[480px] p-8 md:p-16 relative shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center"
                        >
                            <div className="flex flex-col gap-6">
                                <div>
                                    <span className="inline-block border border-[#b997ff]/30 rounded-full px-3.5 py-1 text-[11px] font-mono font-bold tracking-wider text-[#b997ff] bg-[#b997ff]/10 mb-3 uppercase">
                                        {steps[activeTab].badge}
                                    </span>
                                    <h3 className="font-bold text-2xl md:text-3xl text-[#f1f0ec] leading-[1.25] mt-2 tracking-tight">
                                        {steps[activeTab].heading}
                                    </h3>
                                </div>

                                <p className="text-sm md:text-base text-[#d0c9c4] leading-relaxed max-w-[460px]">
                                    {steps[activeTab].description}
                                </p>

                                <div className="pt-2">
                                    <a
                                        href="/signup"
                                        className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold bg-[#00f575] text-black hover:bg-[#00f575]/90 transition-all shadow-[0_0_24px_rgba(0,245,117,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        <span>Start free now</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="w-full max-w-[500px] rounded-3xl p-6 border border-parchment-shadow bg-[#1c1624]/80 shadow-2xl backdrop-blur-xl">
                                    {renderMockup()}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

