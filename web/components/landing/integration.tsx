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
    type LucideIcon
} from "lucide-react";

interface Capability {
    name: string;
    description: string;
    icon: LucideIcon;
    tint: string;
}

const capabilities: Capability[] = [
    {
        name: "Folders",
        description: "Nest folders as deep as you need and move files between them.",
        icon: FolderTree,
        tint: "bg-[#f3f4f6]",
    },
    {
        name: "Starred",
        description: "Pin the files you reach for constantly, right at the top.",
        icon: Star,
        tint: "bg-[#fff7ed]",
    },
    {
        name: "Trash",
        description: "Deleted files land here first — restore them before they're gone.",
        icon: Trash2,
        tint: "bg-[#fef2f2]",
    },
    {
        name: "Shared with me",
        description: "See every file and folder someone else has shared with you.",
        icon: Share2,
        tint: "bg-[#eff6ff]",
    },
    {
        name: "Notifications",
        description: "Know the moment someone shares a file or changes your access.",
        icon: Bell,
        tint: "bg-[#f0fdf4]",
    },
    {
        name: "Search",
        description: "Find any file by name the instant you need it.",
        icon: Search,
        tint: "bg-[#f9fafb]",
    },
    {
        name: "Ask Silvi",
        description: "Find, move, star, or share files by asking in plain language.",
        icon: Sparkles,
        tint: "bg-[#f5f6ff]",
    },
    {
        name: "Private by default",
        description: "Every upload is visible only to you until you decide otherwise.",
        icon: Lock,
        tint: "bg-[#f9fafb]",
    },
];

export default function LandingHighlights({ className }: { className?: string }) {
    return (
        <section className={"bg-[#ffffff] py-20 px-6 md:px-[60px] font-sans " + (className || "")}>
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                    <div className="w-full md:w-[55%]">
                        <h2 className="text-[#111111] font-semibold text-[36px] md:text-[48px] leading-[1.1] mb-4 tracking-tight">
                            Everything Your Files Need, Built In
                        </h2>
                        <p className="text-[#666666] text-[15px] leading-[1.65] max-w-[480px]">
                            No third-party apps to connect. Folders, sharing, search, and an
                            assistant that asks first — all in one private drive.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <a href="/signup" className="flex-1 md:flex-none bg-laser-violet text-white rounded-full px-[22px] py-3 text-sm font-semibold hover:bg-[#2d2734] transition-all hover:shadow-lg cursor-pointer text-center">
                            Get started for free
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {capabilities.map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="bg-[#ffffff] border border-[#f0f0f0] rounded-[20px] p-8 md:px-7 md:py-8 flex flex-col hover:border-laser-violet hover:shadow-xl transition-all duration-300 group cursor-default"
                        >
                            <div className={"w-[52px] h-[52px] rounded-[12px] flex items-center justify-center mb-7 text-laser-violet " + item.tint}>
                                <item.icon className="w-6 h-6" strokeWidth={1.75} />
                            </div>
                            <h3 className="text-[#111111] font-bold text-lg mb-2">
                                {item.name}
                            </h3>
                            <p className="text-[#666666] text-sm leading-[1.6]">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
