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
        tabLabel: "1. Upload",
        tabIcon: <Compass className="w-5 h-5" />,
        badge: "STEP 01: UPLOAD",
        heading: "Drop files in, they stream straight to storage.",
        description: "Drag files anywhere on the page. Uploads go directly browser-to-S3 with live progress — no file-count limits, no waiting on our servers to relay big files.",
        mockupType: "upload",
    },
    {
        id: "step-2",
        tabLabel: "2. Organize",
        tabIcon: <FolderPlus className="w-5 h-5" />,
        badge: "STEP 02: ORGANIZE",
        heading: "Nest folders as deep as you need.",
        description: "Create folders, nest them, and move files between them from the dashboard. Your drive stays exactly as tidy as you want it to be.",
        mockupType: "organize",
    },
    {
        id: "step-3",
        tabLabel: "3. Share",
        tabIcon: <Share2 className="w-5 h-5" />,
        badge: "STEP 03: SHARE",
        heading: "Choose exactly who sees it.",
        description: "Keep a file private, flip it to a public link, or grant access to one person by email. Revoke it in one click, any time, no support ticket required.",
        mockupType: "share",
    },
    {
        id: "step-4",
        tabLabel: "4. Ask Silvi",
        tabIcon: <Wand2 className="w-5 h-5" />,
        badge: "STEP 04: ASK SILVI",
        heading: "Manage it all in plain language.",
        description: "Ask Silvi to find a file, check your storage, or share something. Sensitive actions always pause for your confirmation first — nothing happens behind your back.",
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
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/80 p-3 rounded-xl border border-white/50 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-laser-violet/10 flex items-center justify-center text-laser-violet">
                        <UploadCloud className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111]">Uploading files...</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00f575] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#00f575]">ACTIVE</span>
                </div>
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerVisible}
                className="grid grid-cols-1 gap-3"
            >
                {[
                    { name: "product-launch.mp4", size: "812 MB", status: "72%" },
                    { name: "team-offsite.zip", size: "156 MB", status: "Done" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        variants={rowVariants}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#111] font-bold text-xs">
                                {item.name[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-[#111]">{item.name}</p>
                                <p className="text-[10px] text-[#888]">{item.size}</p>
                            </div>
                        </div>
                        <div className="bg-laser-violet/5 px-3 py-1 rounded-full border border-laser-violet/10">
                            <span className="text-xs font-black text-laser-violet">{item.status}</span>
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
        <div className="space-y-5">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="bg-gray-50/50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Share settings</span>
                    <Link2 className="w-3 h-3 text-laser-violet" />
                </div>
                <div className="p-5 space-y-3">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={shareStagger}
                        className="space-y-3"
                    >
                        {[
                            { label: "Public link", state: "Off" },
                            { label: "j.rivera@company.com", state: "Access granted" },
                        ].map((row) => (
                            <motion.div key={row.label} variants={shareLineVariants} className="flex items-center justify-between">
                                <span className="text-[12px] font-medium text-gray-600">{row.label}</span>
                                <span className="text-[10px] font-bold text-laser-violet bg-laser-violet/5 px-2 py-0.5 rounded-full">{row.state}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between px-2"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        <Link2 className="w-4 h-4 text-[#888]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#111]">Unguessable link ready</span>
                </div>
                <div className="px-3 py-1.5 bg-laser-violet text-white rounded-lg text-[10px] font-bold shadow-lg shadow-laser-violet/20">
                    Copy Link
                </div>
            </motion.div>
        </div>
    );
}

function OrganizeMockup() {
    return (
        <div className="space-y-5">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerVisible}
                className="grid grid-cols-2 gap-4"
            >
                {[
                    { icon: <FolderTree />, value: "18", label: "Folders", isGreen: true, color: "#b997ff" },
                    { icon: <TrendingUp />, value: "247", label: "Files organized", isGreen: false, color: "#111" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={rowVariants}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                            style={{ backgroundColor: stat.isGreen ? "rgba(185, 151, 255, 0.08)" : "#f9fafb", color: stat.color }}
                        >
                            {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
                        </div>
                        <p className="text-2xl font-black text-[#111]">{stat.value}</p>
                        <p className="text-[10px] font-bold text-[#888] uppercase">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-laser-violet p-5 rounded-2xl text-white shadow-xl"
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#b997ff]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff9efa]">Folder tree</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-mono">
                    /Design &gt; /Q3 &gt; /Assets — 3 levels deep, dragged into place.
                </p>
            </motion.div>
        </div>
    );
}

const assistantNodeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
};

function AssistantMockup() {
    return (
        <div className="space-y-6">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerVisible}
                className="flex items-center justify-around py-4 relative"
            >
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -translate-y-1/2" />
                {[
                    { icon: <Search />, active: true },
                    { icon: <Sparkles />, active: true },
                    { icon: <CheckCircle2 />, active: false },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        variants={assistantNodeVariants}
                        className={"relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 " + (item.active ? "bg-white border-laser-violet text-laser-violet shadow-md" : "bg-gray-50 border-gray-100 text-gray-300")}
                    >
                        {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#111]">Silvi status</span>
                    <span className="text-[10px] font-bold text-laser-violet bg-laser-violet/5 px-2 py-0.5 rounded">Awaiting your confirmation</span>
                </div>
                <p className="text-[11px] text-[#888] leading-relaxed">
                    &ldquo;Share Q3 invoices with j.rivera?&rdquo; — nothing sensitive happens until you say yes.
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
            className={"bg-white py-24 px-6 md:px-20 font-sans overflow-hidden " + (className || "")}
        >
            <div className="max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-medium text-4xl md:text-[48px] text-[#111111] leading-tight mb-4 tracking-tight">
                        From upload to shared, in four steps
                    </h2>
                    <p className="text-[16px] text-[#888888] max-w-[520px] mx-auto leading-relaxed">
                        No roadmap items, no promises — this is what Silo actually does today.
                    </p>
                </motion.div>

                <div className="bg-[#f4f4f4] rounded-t-[32px] flex flex-row overflow-x-auto no-scrollbar border-x border-t border-[#e5e5e5] p-2">
                    {steps.map((step, index) => (
                        <motion.button
                            key={step.id}
                            onClick={() => setActiveTab(index)}
                            whileHover={{ scale: 1.02 }}
                            className={"flex-1 min-w-[180px] md:min-w-0 py-4 px-6 flex items-center justify-center gap-3.5 transition-all duration-500 relative rounded-[22px] group outline-none border " + (activeTab === index ? "bg-white border-gray-100 text-[#111]" : "border-transparent text-[#777] hover:text-[#333] hover:bg-white/50")}
                        >
                            <div className={"w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 " + (activeTab === index ? "bg-laser-violet text-white shadow-[0_8px_20px_-4px_rgba(185,151,255,0.4)]" : "bg-white border border-gray-200 text-[#888] group-hover:border-laser-violet/30 group-hover:text-laser-violet")}>
                                {step.tabIcon}
                            </div>
                            <span className={"text-[15px] whitespace-nowrap tracking-tight transition-all duration-300 " + (activeTab === index ? "font-bold" : "font-medium")}>
                                {step.tabLabel}
                            </span>
                        </motion.button>
                    ))}
                </div>

                <div className="bg-white rounded-b-[32px] border-x border-b border-[#eeeeee] min-h-[520px] p-8 md:p-20 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                            className="grid lg:grid-cols-[45%_55%] gap-16 items-center"
                        >
                            <div className="flex flex-col gap-8">
                                <div>
                                    <span className="inline-block border border-laser-violet/20 rounded-full px-4 py-1 text-[11px] font-bold tracking-[2px] text-laser-violet bg-laser-violet/5 mb-4 uppercase">
                                        {steps[activeTab].badge}
                                    </span>
                                    <h3 className="font-medium text-3xl md:text-[40px] text-[#111111] leading-[1.2] mt-2 tracking-tight">
                                        {steps[activeTab].heading}
                                    </h3>
                                </div>

                                <p className="text-[16px] text-[#666666] leading-[1.7] max-w-[440px]">
                                    {steps[activeTab].description}
                                </p>

                                <div className="mt-4">
                                    <a
                                        href="/signup"
                                        className="relative overflow-hidden bg-[#111] text-white rounded-2xl px-10 py-5 text-[16px] font-bold flex items-center gap-3 hover:bg-laser-violet transition-all duration-500 group w-fit"
                                    >
                                        <span className="relative z-10">Get started for free</span>
                                        <div className="relative z-10 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000 ease-in-out" />
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="relative w-full max-w-[600px] aspect-[4/3] rounded-[48px] p-10 md:p-14 flex items-center justify-center overflow-hidden group border border-gray-100 bg-gradient-to-br from-laser-violet/[0.04] via-[#f9f9f9] to-[#ff9efa]/[0.06]">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity as number, duration: 4, ease: "easeInOut" as const }}
                                        className="w-full relative z-10 bg-white/70 backdrop-blur-[24px] border border-white/80 rounded-[32px] p-8 shadow-[0_40px_80px_rgba(185,151,255,0.1)] overflow-hidden"
                                    >
                                        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/40 to-transparent rotate-45 pointer-events-none" />
                                        <div className="relative z-10">
                                            {renderMockup()}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
