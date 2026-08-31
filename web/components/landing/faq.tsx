"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Lock, HardDrive, ShieldCheck } from "lucide-react";

const faqs = [
    {
        question: "What makes Silo different from standard cloud storage?",
        answer: "Silo provides zero-knowledge, client-side encrypted storage where only you control encryption keys. Files are private by default, and sharing permissions are cryptographically verified."
    },
    {
        question: "How do public and private links work?",
        answer: "Toggle a file's visibility from the share panel to generate an unguessable token link. Anyone with the token can view it; revoking or switching back to private disables the link immediately."
    },
    {
        question: "Can I share with one person securely without a public link?",
        answer: "Yes. Add their email to the file's access list. They receive targeted access without exposing a public link, and you can revoke their permissions anytime with one click."
    },
    {
        question: "How does folder hierarchy and organization work?",
        answer: "You can create nested folders as deep as needed, drag and drop files between directories, and organize your files instantly with zero latency."
    },
    {
        question: "What happens when I delete a file?",
        answer: "Deleted files move into your encrypted Trash first so you can restore them if needed before permanently emptying the vault."
    },
    {
        question: "Will Silvi ever perform actions without asking?",
        answer: "Never. Silvi is programmed with strict guard protocols: sensitive actions (sharing, modifying permissions, or deleting) always pause for your explicit confirmation first."
    }
];

export default function LandingFaq({ className }: { className?: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section
            id="faq"
            className={"w-full text-[#f1f0ec] py-28 px-6 md:px-12 overflow-hidden relative z-20 border-t border-white/[0.06] bg-[#1c1624] " + (className || "")}
        >
            {/* Ambient Background Glow */}
            <div
                className="absolute top-1/2 left-1/3 size-[500px] bg-[#b997ff]/5 rounded-full blur-[140px] pointer-events-none"
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* Left: heading + stats */}
                    <div className="lg:col-span-5 lg:sticky lg:top-10 flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-semibold text-[#b997ff] tracking-wider uppercase flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-[#00f575]" />
                                Clear Answers
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#f1f0ec] leading-tight tracking-tight">
                                Frequently <br />
                                <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
                                    Answered Questions
                                </span>
                            </h2>
                            <p className="text-[#d0c9c4] text-base leading-relaxed mt-2">
                                Straightforward details on how Silo keeps your vault private, how sharing permissions work, and how Silvi guards your data.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-parchment-shadow">
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/[0.03] border border-parchment-shadow">
                                <span className="text-[11px] font-semibold text-[#a5a2a5] uppercase tracking-wider">
                                    Private by default
                                </span>
                                <span className="text-2xl text-[#f1f0ec] font-bold flex items-center gap-1.5">
                                    100%
                                    <Lock className="w-4 h-4 text-[#00f575]" strokeWidth={2} />
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/[0.03] border border-parchment-shadow">
                                <span className="text-[11px] font-semibold text-[#a5a2a5] uppercase tracking-wider">
                                    Free Storage
                                </span>
                                <span className="text-2xl text-[#f1f0ec] font-bold flex items-center gap-1.5">
                                    5 GB
                                    <HardDrive className="w-4 h-4 text-[#b997ff]" strokeWidth={2} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: accordion */}
                    <div className="lg:col-span-7 flex flex-col gap-3.5">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={faq.question}
                                    className={
                                        "transition-all duration-300 rounded-2xl overflow-hidden border backdrop-blur-xl " +
                                        (isOpen
                                            ? "bg-[#2d2734]/80 border-[#b997ff]/40 shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(185,151,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                            : "bg-white/[0.03] border-parchment-shadow hover:border-parchment-shadow hover:bg-white/[0.06]")
                                    }
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full flex items-center justify-between p-5 text-left cursor-pointer focus:outline-none group relative"
                                    >
                                        <div className="flex items-center gap-3.5 pr-4">
                                            <div className={"size-2 rounded-full transition-all " + (isOpen ? "bg-[#00f575] shadow-[0_0_8px_#00f575]" : "bg-marigold-glow/50 group-hover:bg-marigold-glow/70")} />
                                            <h3 className="text-sm md:text-base font-semibold text-[#f1f0ec] leading-snug tracking-tight">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className={
                                                "size-8 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-300 " +
                                                (isOpen
                                                    ? "bg-[#b997ff] border-[#b997ff] text-black shadow-md"
                                                    : "border-parchment-shadow text-[#a5a2a5] group-hover:text-white group-hover:border-parchment-shadow bg-white/[0.04]")
                                            }
                                        >
                                            <ChevronDown className="w-4 h-4" strokeWidth={2} />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                key={"faq-answer-" + index}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 pt-0 border-t border-parchment-shadow">
                                                    <p className="text-xs md:text-sm text-[#d0c9c4] leading-relaxed mt-4 pl-5">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

