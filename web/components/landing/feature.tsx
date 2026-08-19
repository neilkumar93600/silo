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

function GridLine({ vertical = false }: { vertical?: boolean }) {
    return (
        <div
            className={
                "absolute " +
                (vertical ? "w-px h-full top-0" : "h-px w-full left-0") +
                " bg-lavender-mist/60"
            }
        />
    );
}

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
            viewport={{ amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className={"relative p-8 group overflow-hidden flex flex-col " + className}
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-eclipse-black border border-lavender-mist flex items-center justify-center text-ash-wisp group-hover:text-laser-violet transition-colors duration-300">
                        <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-paper-white tracking-tight">{title}</h3>
                </div>
                <p className="text-sm text-ash-wisp leading-relaxed mb-6 max-w-[280px]">
                    {description}
                </p>
                <div className="flex-1 flex flex-col">
                    {children}
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-laser-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
            className={"bg-void-plum py-24 px-6 md:px-12 font-sans overflow-hidden " + (className || "")}
        >
            <div className="max-w-7xl mx-auto relative">

                {/* Header Section */}
                <div className="mb-20 relative">
                    <div className="grid md:grid-cols-2 gap-12 items-end">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.2 }}
                            transition={{ duration: 0.6 }}
                            className="text-[48px] font-semibold text-paper-white tracking-tight leading-[1.1]"
                        >
                            Designed for speed, <br />
                            built for privacy
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg text-ash-wisp leading-relaxed max-w-md"
                        >
                            Every file stays private by default. Share it your way, organize it
                            your way, and let Silvi handle the rest when you ask.
                        </motion.p>
                    </div>
                </div>

                {/* Main Grid Showcase */}
                <div className="relative border border-lavender-mist rounded-[32px] overflow-hidden bg-carbon-ink">

                    <GridLine />
                    <div className="absolute top-0 left-1/2 w-px h-full bg-lavender-mist/60 hidden md:block" />
                    <div className="absolute top-1/2 left-0 w-full h-px bg-lavender-mist/60 hidden md:block" />
                    <div className="absolute top-0 left-3/4 w-px h-full bg-lavender-mist/60 hidden md:block" />

                    <div className="grid grid-cols-1 md:grid-cols-4 min-h-[600px]">

                        {/* Feature 1: Built for big files (Large) */}
                        <FeatureCard
                            title="Built for big files"
                            description="Uploads stream directly to cloud storage with live progress, built to scale effortlessly."
                            icon={UploadCloud}
                            className="md:col-span-2 md:row-span-2 border-b md:border-b-0 md:border-r border-lavender-mist"
                        >
                            <div className="flex-1 bg-eclipse-black rounded-2xl border border-lavender-mist p-6 relative overflow-hidden group/chart flex flex-col">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex gap-2">
                                        {uploads.map((u, i) => (
                                            <button
                                                key={u.label}
                                                onClick={() => setActiveUpload(i)}
                                                className={
                                                    "px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all " +
                                                    (activeUpload === i
                                                        ? "bg-laser-violet text-paper-white"
                                                        : "bg-carbon-ink text-ash-wisp hover:bg-carbon-ink")
                                                }
                                            >
                                                File {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-paper-white tracking-tight">
                                            {uploads[activeUpload].size}
                                        </p>
                                        <p className="text-[10px] font-bold text-laser-violet">
                                            {uploads[activeUpload].progress} uploaded
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
                                                    ? "bg-carbon-ink"
                                                    : "bg-laser-violet/20 group-hover/chart:bg-laser-violet/40 transition-colors")
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Monospace Data Overlay */}
                                <div className="absolute bottom-2 right-4 font-mono text-[9px] text-ash-wisp uppercase tracking-widest">
                                    Streaming_Direct_To_S3
                                </div>
                            </div>
                        </FeatureCard>

                        {/* Feature 2: Share, your way */}
                        <FeatureCard
                            title="Share, your way"
                            description="Flip a file to a public link, or grant one person direct access — revocable anytime."
                            icon={Link2}
                            className="md:col-span-2 border-b border-lavender-mist"
                        >
                            <div className="mt-4 flex flex-col gap-3">
                                {[
                                    { label: "Public link: team-offsite.zip", status: "Active", color: "bg-signal-green" },
                                    { label: "Shared with j.rivera", status: "Revocable", color: "bg-neon-violet" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between bg-eclipse-black p-3 rounded-xl border border-lavender-mist"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={"w-2 h-2 rounded-full " + item.color} />
                                            <span className="text-xs font-medium text-silver-smoke">{item.label}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-ash-wisp uppercase tracking-wider">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </FeatureCard>

                        {/* Feature 3: Ask Silvi */}
                        <FeatureCard
                            title="Ask Silvi"
                            description="Find, move, star, or share files by asking in plain language."
                            icon={Sparkles}
                            className="border-b md:border-b-0 md:border-r border-lavender-mist"
                        >
                            <div className="mt-4 bg-void-plum rounded-xl p-4 font-mono text-[10px] leading-tight overflow-hidden relative group/api">
                                <div className="flex gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex gap-2">
                                        <span className="text-purple-400">you:</span>
                                        <span className="text-ash-wisp">find my Q3 invoices</span>
                                    </div>
                                    <div className="pl-4 text-[#b997ff]">2 files found in /Finance</div>
                                    <div className="flex gap-2 pt-1">
                                        <span className="text-purple-400">you:</span>
                                        <span className="text-ash-wisp">share with j.rivera</span>
                                    </div>
                                    <div className="pl-4 text-yellow-400/80">confirm before sharing?</div>
                                </div>
                                <motion.div
                                    animate={{ opacity: [1, 0] }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity as number,
                                    }}
                                    className="absolute bottom-4 left-[130px] w-1.5 h-3 bg-[#b997ff]/60"
                                />
                            </div>
                        </FeatureCard>

                        {/* Feature 4: Private by default */}
                        <FeatureCard
                            title="Private by default"
                            description="Every file you upload is visible only to you, until you decide otherwise."
                            icon={Lock}
                            className=""
                        >
                            <div className="mt-4 relative h-24 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full border border-dashed border-lavender-mist animate-[spin_10s_linear_infinite]" />
                                    <div className="absolute w-20 h-20 rounded-full border border-dashed border-lavender-mist/50 animate-[spin_15s_linear_infinite_reverse]" />
                                </div>
                                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-laser-violet/5 border border-laser-violet/10">
                                    <Lock size={22} className="text-laser-violet" strokeWidth={1.75} />
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-eclipse-black px-2 py-1 rounded-full border border-lavender-mist">
                                    <Users size={10} className="text-laser-violet" />
                                    <span className="text-[9px] font-bold text-silver-smoke">Visible only to you</span>
                                </div>
                            </div>
                        </FeatureCard>

                    </div>
                </div>

            </div>
        </section>
    );
}
