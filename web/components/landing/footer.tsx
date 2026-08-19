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

function WaveDivider() {
    return (
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-40 md:h-48 overflow-hidden pointer-events-none select-none z-10" aria-hidden="true">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 26, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 w-[200%] h-full opacity-35"
            >
                <svg viewBox="0 0 2880 120" preserveAspectRatio="none" className="w-full h-full text-[#f4f5f7] fill-current">
                    <path d="M0,0 L2880,0 L2880,60 C2600,110 2420,35 2160,75 C1900,115 1740,40 1440,85 C1160,110 980,35 720,75 C460,115 300,40 0,85 Z" />
                </svg>
            </motion.div>
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 18, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 w-[200%] h-full"
            >
                <svg viewBox="0 0 2880 120" preserveAspectRatio="none" className="w-full h-full text-[#f4f5f7] fill-current">
                    <path d="M0,0 L2880,0 L2880,90 C2560,40 2400,110 2160,65 C1920,20 1760,95 1440,45 C1120,40 960,110 720,65 C480,20 320,95 0,45 Z" />
                </svg>
            </motion.div>
        </div>
    );
}

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
            className={"w-full bg-void-plum pt-36 sm:pt-44 md:pt-48 pb-12 px-6 sm:px-12 md:px-16 lg:px-24 font-sans text-white/80 overflow-hidden relative " + (className || "")}
        >
            <WaveDivider />
            <div className="absolute right-0 bottom-0 w-[450px] h-[450px] bg-[#ff9efa]/[0.05] rounded-full blur-[100px] pointer-events-none select-none z-0" aria-hidden="true" />

            <div className="max-w-[1280px] mx-auto w-full relative z-10 pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">

                    {/* Brand + newsletter */}
                    <div className="lg:col-span-5 flex flex-col items-start justify-between">
                        <div className="w-full">
                            <div className="flex items-center gap-2">
                                <Logo className="h-7 w-auto shrink-0 text-white" />
                                <span className="text-white text-[32px] font-freckle tracking-wide">Silo</span>
                            </div>
                            <p className="font-normal text-white/70 text-[14px] sm:text-[15px] mt-4 leading-relaxed max-w-[380px]">
                                Private file sharing. Keep what&apos;s yours, share what you choose —
                                a public link, or a direct grant to one person, revocable anytime.
                            </p>

                            <div className="mt-8 max-w-[380px] w-full">
                                <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-[#ff9efa]" />
                                    Get product updates
                                </h5>
                                <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
                                    <input
                                        required
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="w-full bg-white/5 border border-white/15 focus:border-[#ff9efa] text-white placeholder-white/30 text-xs sm:text-sm rounded-full py-3.5 pl-5 pr-14 focus:outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-1.5 w-10 h-10 rounded-full bg-[#ff9efa] hover:bg-[#ffc2fb] text-laser-violet flex items-center justify-center transition-all duration-300 scale-95 cursor-pointer hover:scale-100"
                                        aria-label="Subscribe"
                                    >
                                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                </form>
                                {subscribed && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[#ff9efa] text-xs mt-2 pl-5"
                                    >
                                        Thanks — you&apos;re in.
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Nav columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">{col.title}</h4>
                                <div className="flex flex-col gap-3.5 text-xs sm:text-sm font-medium">
                                    {col.links.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="text-white/60 hover:text-[#ff9efa] transition-colors duration-200 block"
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
                    <div className="text-white/50 font-light tracking-wide text-center md:text-left">
                        &copy; {new Date().getFullYear()} Silo. All rights reserved.
                    </div>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="w-11 h-11 rounded-full bg-white hover:bg-white/90 text-laser-violet flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.15)] cursor-pointer"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                    </button>
                </div>

                {/* Giant background wordmark */}
                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 select-none pointer-events-none z-0 hidden md:block" aria-hidden="true">
                    <span className="text-white/[0.06] font-freckle text-[120px] lg:text-[180px] tracking-[15px] uppercase leading-none">
                        Silo
                    </span>
                </div>
            </div>
        </footer>
    );
}
