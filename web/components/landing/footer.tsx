"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, ArrowUp } from "lucide-react";
import { Logo } from "@/components/shared/logo";

const columns = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "Meet Silvi", href: "#silvi" },
            { label: "How it works", href: "#how-it-works" },
            { label: "FAQ", href: "#faq" },
        ],
    },
    {
        title: "Account",
        links: [
            { label: "Sign in", href: "/login" },
            { label: "Create account", href: "/signup" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Acceptable Use", href: "/acceptable-use" },
            { label: "Cookie Policy", href: "/cookies" },
        ],
    },
];

export default function LandingFooter({ className }: { className?: string }) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    function handleSubscribe(e: FormEvent) {
        e.preventDefault();
        if (!email.includes("@")) return;
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 2500);
    }

    return (
        <footer
            id="main-footer"
            className={"w-full bg-[#1c1624] pt-24 pb-12 px-6 sm:px-12 md:px-16 lg:px-24 font-sans text-warm-stone overflow-hidden relative border-t border-parchment-shadow " + (className || "")}
        >
            <div className="absolute right-0 bottom-0 size-[450px] bg-[#b997ff]/[0.04] rounded-full blur-[120px] pointer-events-none select-none z-0" aria-hidden="true" />
            <div className="absolute left-0 bottom-0 size-[350px] bg-[#00f575]/[0.03] rounded-full blur-[100px] pointer-events-none select-none z-0" aria-hidden="true" />

            <div className="max-w-[1280px] mx-auto w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-parchment-shadow">

                    {/* Brand + newsletter */}
                    <div className="lg:col-span-5 flex flex-col items-start justify-between">
                        <div className="w-full">
                            <div className="flex items-center gap-2">
                                <Logo className="h-7 w-auto shrink-0 text-white" />
                                <span className="text-white text-[32px] font-freckle tracking-wide">Silo</span>
                            </div>
                            <p className="font-normal text-[#d0c9c4] text-sm sm:text-base mt-4 leading-relaxed max-w-[380px]">
                                Private, client-side encrypted storage. Keep what&apos;s yours, share what you choose with cryptographic verification.
                            </p>

                            <div className="mt-8 max-w-[380px] w-full">
                                <h5 className="text-xs font-semibold text-[#f1f0ec] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-[#b997ff]" />
                                    Get product updates
                                </h5>
                                <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
                                    <input
                                        required
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="w-full bg-white/[0.04] border border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood text-xs sm:text-sm rounded-full py-3.5 pl-5 pr-14 focus:outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-1.5 size-10 rounded-full bg-[#00f575] text-black flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(0,245,117,0.3)]"
                                        aria-label="Subscribe"
                                    >
                                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                </form>
                                {subscribed && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[#00f575] text-xs mt-2 pl-5 font-mono"
                                    >
                                        Thanks — you&apos;re subscribed.
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Nav columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h4 className="text-xs font-bold text-[#f1f0ec] uppercase tracking-widest mb-6">{col.title}</h4>
                                <div className="flex flex-col gap-3.5 text-xs sm:text-sm font-medium">
                                    {col.links.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="text-[#a5a2a5] hover:text-[#b997ff] transition-colors duration-200 block cursor-pointer"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 text-[13px] relative z-10">
                    <div className="text-[#a5a2a5] font-light tracking-wide text-center md:text-left">
                        &copy; {new Date().getFullYear()} Silo. All rights reserved.
                    </div>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="size-10 rounded-full bg-white/[0.06] border border-parchment-shadow hover:border-[#b997ff]/40 hover:bg-marigold-glow/50 text-[#f1f0ec] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                </div>

                {/* Background wordmark */}
                <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 select-none pointer-events-none z-0 hidden md:block" aria-hidden="true">
                    <span className="text-white/[0.03] font-freckle text-[120px] lg:text-[160px] tracking-[15px] uppercase leading-none">
                        Silo
                    </span>
                </div>
            </div>
        </footer>
    );
}

