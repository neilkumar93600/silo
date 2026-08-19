"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Lock, HardDrive } from "lucide-react";

const faqs = [
    {
        question: "What is Silo?",
        answer: "Silo is a private file sharing app. Every file you upload stays private by default, visible only to you, until you choose to share it."
    },
    {
        question: "How do I make a file public?",
        answer: "Toggle a file's visibility to public from the share panel to generate an unguessable link. Anyone with the link can view it; switch it back to private to disable the link instantly."
    },
    {
        question: "Can I share with just one person instead of a public link?",
        answer: "Open the file's share panel and add the person's email. They get direct access to that file without it becoming publicly linkable, and you can revoke their access at any time."
    },
    {
        question: "Can I organize my files into folders?",
        answer: "Yes — create folders, nest them, and move files between them from the dashboard."
    },
    {
        question: "What happens when I delete a file?",
        answer: "It moves to Trash first, not gone immediately. You can restore it from there before you decide to empty Trash for good."
    },
    {
        question: "Will Silvi ever share or delete something without asking?",
        answer: "No. Silvi can find, move, star, or share files for you in plain language, but it always pauses for your confirmation before any sensitive action."
    }
];

export default function LandingFaq({ className }: { className?: string }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section
            id="faq-section"
            className={"w-full text-paper-white py-24 px-6 md:px-12 overflow-hidden relative z-20 border-t border-b border-lavender-mist bg-void-plum " + (className || "")}
        >
            <div
                className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.012)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-80"
                aria-hidden="true"
            />
            <div
                className="absolute top-1/2 left-1/3 w-[550px] h-[550px] bg-laser-violet/[0.03] rounded-full blur-[140px] pointer-events-none"
                aria-hidden="true"
            />

            <div className="max-w-[1240px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] lg:gap-[60px] items-start">
                    {/* Left: heading + stats */}
                    <div className="lg:col-span-5 lg:sticky lg:top-10 flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <span className="text-[13px] font-semibold text-laser-violet tracking-[0.25em] uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-laser-violet" />
                                Product FAQ
                            </span>
                            <h2 className="font-nasalization text-[#111317] text-[32px] sm:text-[40px] md:text-[44px] font-normal leading-tight tracking-wide uppercase">
                                Frequently<br />Answered<br />Questions
                            </h2>
                            <p className="text-neutral-500 text-sm sm:text-base font-normal leading-relaxed mt-2">
                                Straight answers about how Silo keeps your files private, how sharing
                                works, and what Silvi will and won&apos;t do on its own.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    Private by default
                                </span>
                                <span className="text-2xl text-[#111317] font-nasalization flex items-center gap-1.5">
                                    100%
                                    <Lock className="w-4 h-4 text-laser-violet" strokeWidth={2} />
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    Free to start
                                </span>
                                <span className="text-2xl text-[#111317] font-nasalization flex items-center gap-1.5">
                                    5 GB
                                    <HardDrive className="w-4 h-4 text-laser-violet" strokeWidth={2} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: accordion */}
                    <div className="lg:col-span-7 flex flex-col gap-[15px]">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={faq.question}
                                    className={
                                        "transition-all duration-300 rounded-[20px] overflow-hidden border " +
                                        (isOpen
                                            ? "bg-[#FCFDFE] border-laser-violet/40 shadow-[0_10px_30px_rgba(185,151,255,0.06)]"
                                            : "bg-[#FAFAFA] border-neutral-200/70 hover:border-neutral-300 shadow-sm")
                                    }
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none group relative"
                                    >
                                        {isOpen && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-laser-violet" />
                                        )}
                                        <div className="flex items-center gap-5 pr-4 pl-2">
                                            <h3 className="text-base font-normal text-[#111317] uppercase tracking-wider leading-snug font-nasalization">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as const }}
                                            className={
                                                "w-8 h-8 shrink-0 rounded-full flex items-center justify-center border transition-all duration-300 " +
                                                (isOpen
                                                    ? "bg-laser-violet border-laser-violet text-white shadow-[0_4px_12px_rgba(185,151,255,0.3)]"
                                                    : "border-neutral-200 text-neutral-400 group-hover:text-neutral-700 group-hover:border-neutral-300 bg-white")
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
                                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] as const }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-8 pb-6 pt-0 border-t border-neutral-100/50">
                                                    <p className="text-sm sm:text-[15px] text-neutral-600 leading-relaxed font-normal mt-5 pl-12">
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
