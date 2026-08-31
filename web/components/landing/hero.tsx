"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";

const BAR_HEIGHTS = [
    23, 40, 53, 40, 33, 14, 7, 17, 75, 65,
    88, 75, 65, 47, 33, 88, 4, 7, 9, 14,
    95, 65, 79, 37, 7, 40, 17, 20, 62, 47,
    92, 72,
];

const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "Silvi", href: "#silvi" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
];

function Animate({
    children,
    delay = 0,
    className = "",
    direction = "up",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: "up" | "down" | "scale";
}) {
    const directionClass = {
        up: "animate-fade-in-up",
        down: "animate-fade-down",
        scale: "animate-fade-scale-flat",
    }[direction];

    return (
        <div
            className={`opacity-0 ${directionClass} ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function StatCard() {
    const maxHeight = Math.max(...BAR_HEIGHTS);

    return (
        <Animate delay={900} direction="scale" className="w-full max-w-[405px] mx-auto lg:mx-0">
            <div className="w-full rounded-[20px] bg-white border border-parchment-shadow shadow-harvest-lg p-5 sm:p-8 pb-5 sm:pb-6">
                <p className="text-ink-black text-[16px] sm:text-[20px] font-[450] leading-[20px] mb-3 sm:mb-4">
                    Data Encrypted (GB)
                </p>

                <p className="mb-2 sm:mb-3">
                    <span className="text-ink-black text-[28px] sm:text-[46px] font-[450] leading-[1]">482,109</span>
                    <span className="text-driftwood text-[28px] sm:text-[46px] font-[450] leading-[1]">.40</span>
                </p>

                <div className="flex items-center gap-[10px] mb-6 sm:mb-8">
                    <span className="badge-harvest px-[6px] py-[7px] text-[12px] sm:text-[14px] font-[450] leading-[14px]">
                        +32.4%
                    </span>
                    <span className="text-warm-stone text-[12px] sm:text-[14px] font-[450] leading-[14px]">
                        vs. previous period (364,502 GB)
                    </span>
                </div>

                <div className="relative">
                    <div className="flex items-end gap-[1.5px] h-[80px] sm:h-[100px]">
                        {BAR_HEIGHTS.map((h, i) => {
                            const isProjected = i >= 28;
                            const heightPercent = (h / maxHeight) * 100;
                            return (
                                <div
                                    key={i}
                                    className={"flex-1 rounded-[0.5px] animate-bar-grow origin-bottom " + (isProjected ? "bg-marigold-glow" : "bg-harvest-flame")}
                                    style={{
                                        height: `${heightPercent}%`,
                                        animationDelay: `${1100 + i * 30}ms`,
                                    }}
                                />
                            );
                        })}
                    </div>

                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="absolute top-0 bottom-0 w-px bg-parchment-shadow"
                                style={{ left: `${((i + 1) / 5) * 100}%` }}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between mt-3">
                        {["10:00", "12:00", "14:00", "16:00", "16:00"].map((t, i) => (
                            <span
                                key={i}
                                className={"text-[9px] sm:text-[10px] font-[450] leading-[10px] text-driftwood " + (i >= 3 ? "opacity-40" : "opacity-100")}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Animate>
    );
}

function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <nav className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] pt-[20px] sm:pt-[30px] flex items-center justify-between relative z-50">
                <Animate delay={0} direction="down">
                    <div className="flex items-center gap-2.5">
                        <Logo className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]" />
                        <span className="text-ink-black text-[22px] sm:text-[26px] font-freckle leading-none tracking-wide">
                            Silo
                        </span>
                    </div>
                </Animate>

                <Animate delay={100} direction="down" className="hidden lg:block">
                    <div className="h-[52px] px-6 flex items-center gap-[30px] bg-white/70 border border-parchment-shadow rounded-[16px] backdrop-blur-md shadow-harvest-sm">
                        {NAV_LINKS.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-warm-stone text-[14px] font-[450] leading-[14px] hover:text-ink-black transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </Animate>

                <Animate delay={200} direction="down" className="hidden lg:block">
                    <div className="h-[52px] p-[3px] bg-white/70 border border-parchment-shadow rounded-[16px] backdrop-blur-md shadow-harvest-sm flex items-center gap-[5px]">
                        <a
                            href="/login"
                            className="h-[46px] px-6 rounded-[13px] text-ink-black text-[14px] font-[450] leading-[14px] hover:bg-marigold-glow/50 transition-colors flex items-center"
                        >
                            Log in
                        </a>
                        <a
                            href="/signup"
                            className="btn-primary-harvest h-[46px] px-6 text-[14px] leading-[14px] flex items-center"
                        >
                            Get started
                        </a>
                    </div>
                </Animate>

                <Animate delay={100} direction="down" className="lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        className="w-[44px] h-[44px] flex items-center justify-center rounded-[13px] bg-white/70 border border-parchment-shadow backdrop-blur-md transition-colors hover:bg-marigold-glow/50"
                    >
                        <div className="relative w-5 h-5">
                            <Menu
                                className={`w-5 h-5 text-ink-black absolute inset-0 transition-all duration-300 ease-out ${isOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`}
                            />
                            <X
                                className={`w-5 h-5 text-ink-black absolute inset-0 transition-all duration-300 ease-out ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
                            />
                        </div>
                    </button>
                </Animate>
            </nav>

            <div
                className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? "visible" : "invisible"}`}
            >
                <div
                    onClick={() => setIsOpen(false)}
                    className={`absolute inset-0 bg-cream-canvas/90 backdrop-blur-md transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
                />

                <div
                    className={`absolute top-[76px] sm:top-[86px] left-4 right-4 sm:left-6 sm:right-6 bg-white shadow-harvest-lg rounded-[20px] border border-parchment-shadow p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-[0.97]"}`}
                >
                    <div className="flex flex-col gap-1">
                        {NAV_LINKS.map((item, i) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                style={{ transitionDelay: isOpen ? `${100 + i * 50}ms` : "0ms" }}
                                className={`flex items-center justify-between px-4 py-4 rounded-[12px] text-ink-black text-[18px] font-[450] hover:bg-marigold-glow/40 transition-all duration-300 ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className="h-px bg-parchment-shadow my-5" />

                    <div
                        className="flex flex-col gap-3 transition-all duration-300"
                        style={{ transitionDelay: isOpen ? "350ms" : "0ms" }}
                    >
                        <a
                            href="/signup"
                            className={`btn-primary-harvest w-full h-[50px] text-[15px] flex items-center justify-center ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                        >
                            Get started
                        </a>
                        <a
                            href="/login"
                            className={`w-full h-[50px] rounded-[16px] border border-bone text-ink-black text-[15px] font-[450] transition-colors hover:bg-marigold-glow/40 flex items-center justify-center ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                        >
                            Log in
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function LandingHero({ className }: { className?: string }) {
    return (
        <section className={"relative w-full h-screen overflow-hidden bg-cream-canvas " + (className || "")}>
            {/* Hero Gradient Wash — soft flowing warm wash behind hero content (per DESIGN.md) */}
            <div className="absolute inset-0 bg-gradient-to-br from-marigold-glow/70 via-cream-canvas to-cream-canvas" />
            <div className="absolute -top-32 -right-32 size-[500px] rounded-full bg-harvest-flame/10 blur-[130px]" />
            <div className="absolute bottom-0 -left-40 size-[450px] rounded-full bg-marigold-glow/60 blur-[130px]" />

            <div className="relative z-10 h-full flex flex-col">
                <Nav />

                <div className="flex-1 flex items-center py-8">
                    <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-12">
                        <div className="max-w-[593px]">
                            <Animate delay={300} direction="up">
                                <h1 className="font-serif text-ink-black text-[36px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-normal leading-[0.95] mb-5 sm:mb-8">
                                    Keep what&apos;s yours, share what you choose
                                </h1>
                            </Animate>

                            <Animate delay={500} direction="up">
                                <p className="text-warm-stone text-[16px] sm:text-[18px] md:text-[20px] font-[450] leading-[1.3] max-w-[370px] mb-7 sm:mb-10">
                                    Zero-knowledge encrypted storage, automated organization, and permissions you can verify
                                </p>
                            </Animate>

                            <Animate delay={700} direction="up">
                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                    <a
                                        href="/signup"
                                        className="btn-primary-harvest h-[46px] sm:h-[51px] px-5 sm:px-[27px] text-[14px] sm:text-[15.5px] leading-[15.5px] flex items-center"
                                    >
                                        Get started for free
                                    </a>
                                    <a
                                        href="#how-it-works"
                                        className="h-[46px] sm:h-[51px] px-5 sm:px-[27px] rounded-[16px] border border-bone text-ink-black text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-colors hover:bg-marigold-glow/30 flex items-center"
                                    >
                                        See how it works
                                    </a>
                                </div>
                            </Animate>

                            <Animate delay={800} direction="up">
                                <p className="text-warm-stone text-[13px] font-[450] mt-4 flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-harvest-flame" />
                                    5 GB encrypted storage free · No credit card required
                                </p>
                            </Animate>
                        </div>

                        <StatCard />
                    </div>
                </div>
            </div>
        </section>
    );
}
