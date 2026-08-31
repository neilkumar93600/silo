"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Users } from "lucide-react";
import { CyberUploadIcon, RevocableLinkIcon, VaultIcon, SilviSparkle } from "@/components/icons";

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
            className={"relative p-8 group overflow-hidden flex flex-col transition-all duration-300 hover:bg-cream-canvas " + className}
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cream-canvas border border-parchment-shadow flex items-center justify-center text-ink-black group-hover:text-harvest-flame group-hover:border-harvest-flame/40 transition-all duration-300 shadow-harvest-sm">
                        <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-ink-black tracking-tight">{title}</h3>
                </div>
                <p className="text-sm text-warm-stone leading-relaxed mb-6 max-w-[280px]">
                    {description}
                </p>
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-marigold-glow/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
            className={"bg-cream-canvas py-28 px-6 md:px-12 font-sans overflow-hidden border-t border-parchment-shadow " + (className || "")}
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
                            className="text-4xl md:text-5xl font-bold text-ink-black tracking-tight leading-[1.15]"
                        >
                            Designed for speed, <br />
                            <span className="text-harvest-flame">engineered for privacy.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-base text-warm-stone leading-relaxed max-w-md"
                        >
                            Every file is protected with zero-knowledge encryption by default. Share with revocable permissions, organize with one-click folder trees, and collaborate securely.
                        </motion.p>
                    </div>
                </div>

                {/* Main Grid Showcase */}
                <div className="relative border border-parchment-shadow rounded-[20px] overflow-hidden bg-white shadow-harvest-lg">

                    <div className="grid grid-cols-1 md:grid-cols-4 min-h-[600px] divide-y md:divide-y-0 md:divide-x divide-parchment-shadow">

                        {/* Feature 1: Built for big files (Large) */}
                        <FeatureCard
                            title="Built for high-throughput files"
                            description="Uploads stream directly to high-performance cloud storage with live chunk progress and resumption."
                            icon={CyberUploadIcon}
                            className="md:col-span-2 md:row-span-2 border-b md:border-b-0 border-parchment-shadow"
                        >
                            <div className="flex-1 bg-cream-canvas rounded-2xl border border-parchment-shadow p-6 relative overflow-hidden group/chart flex flex-col">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex gap-2">
                                        {uploads.map((u, i) => (
                                            <button
                                                key={u.label}
                                                onClick={() => setActiveUpload(i)}
                                                className={
                                                    "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer " +
                                                    (activeUpload === i
                                                        ? "bg-harvest-flame text-white shadow-harvest-sm"
                                                        : "bg-white text-driftwood border border-parchment-shadow hover:text-ink-black hover:bg-marigold-glow/40")
                                                }
                                            >
                                                File {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-ink-black tracking-tight">
                                            {uploads[activeUpload].size}
                                        </p>
                                        <p className="text-[11px] font-mono font-semibold text-harvest-flame">
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
                                                    ? "bg-bone/40"
                                                    : "bg-harvest-flame/40 group-hover/chart:bg-harvest-flame/60 transition-colors")
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Monospace Data Overlay */}
                                <div className="absolute bottom-2 right-4 font-mono text-[9px] text-driftwood uppercase tracking-widest">
                                    Encrypted_Direct_Stream_Active
                                </div>
                            </div>
                        </FeatureCard>

                        {/* Feature 2: Share, your way */}
                        <FeatureCard
                            title="Share, exactly how you want"
                            description="Flip a file to a public share link, or grant one person direct access with revocable permissions anytime."
                            icon={RevocableLinkIcon}
                            className="md:col-span-2 border-b border-parchment-shadow"
                        >
                            <div className="mt-4 flex flex-col gap-3">
                                {[
                                    { label: "Public link: team-offsite.zip", status: "Active Share" },
                                    { label: "Shared with j.rivera", status: "Cryptographic Key Granted" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between bg-cream-canvas p-3.5 rounded-xl border border-parchment-shadow hover:border-harvest-flame/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="size-2 rounded-full bg-harvest-flame" />
                                            <span className="text-xs font-medium text-ink-black">{item.label}</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-semibold text-driftwood uppercase tracking-wider">
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
                            icon={SilviSparkle}
                            className="border-b md:border-b-0 border-parchment-shadow"
                        >
                            <div className="mt-4 bg-ink-black rounded-xl p-4 font-mono text-[11px] leading-tight overflow-hidden relative group/api border border-parchment-shadow">
                                <div className="flex gap-1.5 mb-2.5">
                                    <div className="size-2 rounded-full bg-destructive/60" />
                                    <div className="size-2 rounded-full bg-marigold-glow/80" />
                                    <div className="size-2 rounded-full bg-harvest-flame/60" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex gap-2">
                                        <span className="text-harvest-flame">you:</span>
                                        <span className="text-bone">find my Q3 invoices</span>
                                    </div>
                                    <div className="pl-4 text-marigold-glow">2 files found in /Finance</div>
                                    <div className="flex gap-2 pt-1">
                                        <span className="text-harvest-flame">you:</span>
                                        <span className="text-bone">share with j.rivera</span>
                                    </div>
                                    <div className="pl-4 text-destructive">confirm before sharing?</div>
                                </div>
                            </div>
                        </FeatureCard>

                        {/* Feature 4: Private by default */}
                        <FeatureCard
                            title="Zero-Knowledge Vault"
                            description="Every file you upload is client-side encrypted and accessible only to you until you explicitly share."
                            icon={VaultIcon}
                            className=""
                        >
                            <div className="mt-4 relative h-28 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="size-16 rounded-full border border-dashed border-parchment-shadow animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute size-20 rounded-full border border-dashed border-harvest-flame/30 animate-[spin_15s_linear_infinite_reverse]" />
                                </div>
                                <div className="relative flex items-center justify-center size-14 rounded-full bg-marigold-glow/50 border border-harvest-flame/30">
                                    <VaultIcon size={20} className="text-harvest-flame" />
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-parchment-shadow shadow-harvest-sm whitespace-nowrap">
                                    <Users size={11} className="text-harvest-flame" />
                                    <span className="text-[10px] font-semibold text-ink-black">Private Vault Locked</span>
                                </div>
                            </div>
                        </FeatureCard>

                    </div>
                </div>

            </div>
        </section>
    );
}
