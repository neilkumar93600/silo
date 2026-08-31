"use client";

import { motion } from "motion/react";
import {
    FolderTree,
    Star,
    Trash2,
    Share2,
    Bell,
    Search,
    Sparkles,
    Lock,
    ArrowRight,
    type LucideIcon
} from "lucide-react";

interface Capability {
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
}

const capabilities: Capability[] = [
    {
        name: "Nested Folders",
        description: "Nest directories as deep as required and move assets with intuitive drag-and-drop.",
        icon: FolderTree,
        color: "text-[#b997ff] bg-[#b997ff]/10 border-[#b997ff]/30",
    },
    {
        name: "Starred Priority",
        description: "Pin critical files and active project repositories right at the top of your dashboard.",
        icon: Star,
        color: "text-[#00f575] bg-[#00f575]/10 border-[#00f575]/30",
    },
    {
        name: "Encrypted Trash",
        description: "Deleted items land here safely first — restore anytime before permanent purge.",
        icon: Trash2,
        color: "text-[#ff5632] bg-[#ff5632]/10 border-[#ff5632]/30",
    },
    {
        name: "Shared With Me",
        description: "Live overview of every file and folder teammates have cryptographically shared with you.",
        icon: Share2,
        color: "text-[#ff9efa] bg-[#ff9efa]/10 border-[#ff9efa]/30",
    },
    {
        name: "Real-time Signals",
        description: "Receive instant notifications the moment access permissions are granted or modified.",
        icon: Bell,
        color: "text-[#00f575] bg-[#00f575]/10 border-[#00f575]/20",
    },
    {
        name: "Instant Search",
        description: "Query across filenames, extensions, and metadata with sub-millisecond client indexing.",
        icon: Search,
        color: "text-[#b997ff] bg-[#b997ff]/10 border-[#b997ff]/20",
    },
    {
        name: "Silvi AI Co-Pilot",
        description: "Natural language file operations that always ask for approval before sensitive steps.",
        icon: Sparkles,
        color: "text-[#ff9efa] bg-[#ff9efa]/10 border-[#ff9efa]/30",
    },
    {
        name: "Private by Default",
        description: "Every byte uploaded remains 100% private to you until you explicitly choose to share.",
        icon: Lock,
        color: "text-[#00f575] bg-[#00f575]/10 border-[#00f575]/30",
    },
];

export default function LandingHighlights({ className }: { className?: string }) {
    return (
        <section className={"bg-[#1c1624] py-28 px-6 md:px-12 font-sans border-t border-white/[0.06] " + (className || "")}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div className="w-full md:w-[60%]">
                        <span className="text-xs font-semibold text-[#b997ff] tracking-wider uppercase flex items-center gap-2 mb-3">
                            <span className="size-1.5 rounded-full bg-[#00f575]" />
                            Comprehensive Vault Tools
                        </span>
                        <h2 className="text-[#f1f0ec] font-bold text-4xl md:text-5xl leading-tight tracking-tight">
                            Everything Your Files Need, <br />
                            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
                                Built Into One Engine.
                            </span>
                        </h2>
                        <p className="text-[#d0c9c4] text-base leading-relaxed max-w-xl mt-4">
                            No fragmented plugins or external sync services. Hierarchical folders, zero-knowledge permissions, sub-millisecond search, and intelligent guardian workflows.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <a href="/signup" className="flex items-center gap-2 bg-[#00f575] text-black rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-[#00f575]/90 transition-all shadow-[0_0_24px_rgba(0,245,117,0.35)] hover:scale-105 active:scale-95 cursor-pointer">
                            <span>Get started for free</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {capabilities.map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.4, delay: index * 0.04 }}
                            className="bg-[#2d2734]/70 border border-parchment-shadow hover:border-parchment-shadow rounded-2xl p-7 flex flex-col hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all duration-300 group backdrop-blur-md cursor-pointer"
                        >
                            <div className={"size-12 rounded-xl flex items-center justify-center mb-6 border transition-transform duration-300 group-hover:scale-110 " + item.color}>
                                <item.icon className="size-5" strokeWidth={2} />
                            </div>
                            <h3 className="text-[#f1f0ec] font-semibold text-lg mb-2 group-hover:text-white transition-colors">
                                {item.name}
                            </h3>
                            <p className="text-[#d0c9c4] text-xs leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

