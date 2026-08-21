"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
    UploadCloud,
    Link2,
    Sparkles,
    Users,
    Lock
} from "lucide-react";

function FeatureCard({
    title,
    description,
    icon: Icon,
    children,
    className = "",
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className={"relative p-8 group overflow-hidden flex flex-col transition-all duration-300 hover:bg-white/[0.02] " + className}
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#2d2734] border border-white/15 flex items-center justify-center text-[#d0c9c4] group-hover:text-[#b997ff] group-hover:border-[#b997ff]/40 transition-all duration-300 shadow-sm">
                        <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#f1f0ec] tracking-tight">{title}</h3>
                </div>
                <p className="text-sm text-[#d0c9c4] leading-relaxed mb-6 max-w-[280px]">
                    {description}
                </p>
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#b997ff]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
}

export default function LandingFeatures({ className }: { className?: string }) {
    const [activeUpload, setActiveUpload] = useState(0);

    const uploads = [
        { label: "product-launch.mp4", size: "812 MB", progress: "72%" },
        { label: "team-offsite.zip", size: "156 MB", progress: "100%" },
        { label: "brand-guidelines.pdf", size: "4.2 MB", progress: "100%" },
    ];

    const barHeights = [
        58, 42, 71, 49, 65, 38, 74, 55, 61, 44, 69, 52,
        63, 47, 72, 40, 66, 50, 15, 22, 12, 18, 25, 14,
    ];

    return (
        <section
            id="features"
            className={"bg-[#1c1624] py-28 px-6 md:px-12 font-sans overflow-hidden border-t border-white/[0.06] " + (className || "")}
        >
            <div className="max-w-7xl mx-auto relative">

                {/* Header Section */}
                <div className="mb-20 relative">
                    <div className="grid md:grid-cols-2 gap-12 items-end">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-[#f1f0ec] tracking-tight leading-[1.15]"
                        >
                            Designed for speed, <br />
                            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
                                engineered for privacy.
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-base text-[#d0c9c4] leading-relaxed max-w-md"
                        >
                            Every file is protected with zero-knowledge encryption by default. Share with revocable permissions, organize with one-click folder trees, and collaborate securely.
                        </motion.p>
                    </div>
                </div>

                {/* Main Grid Showcase */}
                <div className="relative border border-white/15 rounded-[32px] overflow-hidden bg-[#2d2734]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]">

                    <div className="grid grid-cols-1 md:grid-cols-4 min-h-[600px] divide-y md:divide-y-0 md:divide-x divide-white/10">

                        {/* Feature 1: Built for big files (Large) */}
                        <FeatureCard
                            title="Built for high-throughput files"
                            description="Uploads stream directly to high-performance cloud storage with live chunk progress and resumption."
                            icon={UploadCloud}
                            className="md:col-span-2 md:row-span-2 border-b md:border-b-0 border-white/10"
                        >
                            <div className="flex-1 bg-[#1c1624]/60 rounded-2xl border border-white/10 p-6 relative overflow-hidden group/chart flex flex-col backdrop-blur-xl">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex gap-2">
                                        {uploads.map((u, i) => (
                                            <button
                                                key={u.label}
                                                onClick={() => setActiveUpload(i)}
                                                className={
                                                    "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer " +
                                                    (activeUpload === i
                                                        ? "bg-[#b997ff] text-black shadow-[0_0_12px_rgba(185,151,255,0.4)]"
                                                        : "bg-white/[0.04] text-[#a5a2a5] hover:text-white hover:bg-white/10")
                                                }
                                            >
                                                File {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-[#f1f0ec] tracking-tight">
                                            {uploads[activeUpload].size}
                                        </p>
                                        <p className="text-[11px] font-mono font-semibold text-[#00f575]">
                                            {uploads[activeUpload].progress} transferred
                                        </p>
                                    </div>
                                </div>

                                {/* Animated Bars */}
                                <div className="flex-1 flex items-end gap-1.5 min-h-[200px]">
                                    {barHeights.map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: "20%" }}
                                            animate={{
                                                height: h + "%",
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity as number,
                                                repeatType: "reverse" as const,
                                                delay: i * 0.05,
                                            }}
                                            className={
                                                "flex-1 rounded-t-sm " +
                                                (i > 18
                                                    ? "bg-white/[0.05]"
                                                    : "bg-[#b997ff]/25 group-hover/chart:bg-[#b997ff]/45 transition-colors")
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Monospace Data Overlay */}
                                <div className="absolute bottom-2 right-4 font-mono text-[9px] text-[#a5a2a5] uppercase tracking-widest">
                                    Encrypted_Direct_Stream_Active
                                </div>
                            </div>
                        </FeatureCard>

                        {/* Feature 2: Share, your way */}
                        <FeatureCard
                            title="Share, exactly how you want"
                            description="Flip a file to a public share link, or grant one person direct access with revocable permissions anytime."
                            icon={Link2}
                            className="md:col-span-2 border-b border-white/10"
                        >
                            <div className="mt-4 flex flex-col gap-3">
                                {[
                                    { label: "Public link: team-offsite.zip", status: "Active Share", color: "bg-[#00f575]" },
                                    { label: "Shared with j.rivera", status: "Cryptographic Key Granted", color: "bg-[#b997ff]" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between bg-[#1c1624]/80 p-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={"size-2 rounded-full " + item.color} />
                                            <span className="text-xs font-medium text-[#f1f0ec]">{item.label}</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-semibold text-[#a5a2a5] uppercase tracking-wider">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </FeatureCard>

                        {/* Feature 3: Ask Silvi */}
                        <FeatureCard
                            title="Natural Language Commands"
                            description="Search across thousands of files, organize into folder trees, or manage permissions with voice or text."
                            icon={Sparkles}
                            className="border-b md:border-b-0 border-white/10"
                        >
                            <div className="mt-4 bg-[#1c1624] rounded-xl p-4 font-mono text-[11px] leading-tight overflow-hidden relative group/api border border-white/10">
                                <div className="flex gap-1.5 mb-2.5">
                                    <div className="size-2 rounded-full bg-red-500/60" />
                                    <div className="size-2 rounded-full bg-yellow-500/60" />
                                    <div className="size-2 rounded-full bg-[#00f575]/60" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex gap-2">
                                        <span className="text-[#b997ff]">you:</span>
                                        <span className="text-[#d0c9c4]">find my Q3 invoices</span>
                                    </div>
                                    <div className="pl-4 text-[#00f575]">2 files found in /Finance</div>
                                    <div className="flex gap-2 pt-1">
                                        <span className="text-[#b997ff]">you:</span>
                                        <span className="text-[#d0c9c4]">share with j.rivera</span>
                                    </div>
                                    <div className="pl-4 text-[#ff5632]">confirm before sharing?</div>
                                </div>
                            </div>
                        </FeatureCard>

                        {/* Feature 4: Private by default */}
                        <FeatureCard
                            title="Zero-Knowledge Vault"
                            description="Every file you upload is client-side encrypted and accessible only to you until you explicitly share."
                            icon={Lock}
                            className=""
                        >
                            <div className="mt-4 relative h-28 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="size-16 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute size-20 rounded-full border border-dashed border-[#b997ff]/30 animate-[spin_15s_linear_infinite_reverse]" />
                                </div>
                                <div className="relative flex items-center justify-center size-14 rounded-full bg-[#b997ff]/10 border border-[#b997ff]/30">
                                    <Lock size={20} className="text-[#00f575]" strokeWidth={2} />
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#1c1624] px-3 py-1 rounded-full border border-white/15 shadow-sm whitespace-nowrap">
                                    <Users size={11} className="text-[#b997ff]" />
                                    <span className="text-[10px] font-semibold text-[#f1f0ec]">Private Vault Locked</span>
                                </div>
                            </div>
                        </FeatureCard>

                    </div>
                </div>

            </div>
        </section>
    );
}

