"use client";

import { motion } from "motion/react";

const stats = [
    {
        index: "001",
        value: "100%",
        label: "PRIVATE BY DEFAULT, UNTIL YOU SHARE",
        barHeights: [40, 60, 30, 80],
        litCount: 4,
    },
    {
        index: "002",
        value: "5 GB",
        label: "FREE ENCRYPTED STORAGE, NO CARD REQUIRED",
        barHeights: [30, 50, 80, 40],
        litCount: 4,
    },
    {
        index: "003",
        value: "1-click",
        label: "TO REVOKE A SHARED FILE'S ACCESS",
        barHeights: [20, 40, 60, 90],
        litCount: 4,
    },
    {
        index: "004",
        value: "0",
        label: "UNENCRYPTED DATA EXPOSURE RISK",
        barHeights: [30, 50, 70, 100],
        litCount: 4,
    },
];

// ponytail: accent is always harvest-flame (single-accent system) — no per-stat color needed
function MiniBarChart({ heights, litCount }: { heights: number[]; litCount: number }) {
    return (
        <div className="flex items-end gap-[3px] h-5">
            {heights.map((h: number, i: number) => (
                <div
                    key={i}
                    className={"w-[3px] rounded-full transition-all duration-500 " + (i < litCount ? "bg-harvest-flame" : "bg-bone")}
                    style={{ height: h + "%" }}
                />
            ))}
        </div>
    );
}

export default function LandingMetrics({ className }: { className?: string }) {
    return (
        <section className={"w-full bg-cream-canvas py-24 font-sans border-t border-parchment-shadow " + (className || "")}>
            {/* Header Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-xs font-semibold text-harvest-flame tracking-wider uppercase flex items-center gap-2 mb-2">
                        <span className="size-1.5 rounded-full bg-harvest-flame" />
                        System Guarantees
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-ink-black leading-tight tracking-tight">
                        What you <br />
                        <span className="text-harvest-flame">actually get.</span>
                    </h2>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-sm md:text-base text-warm-stone max-w-sm md:text-right leading-relaxed"
                >
                    Four verifiable cryptographic principles active in Silo today — no compromises, no hidden telemetry.
                </motion.p>
            </div>

            {/* Metrics Panel */}
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white border border-parchment-shadow w-full rounded-[20px] shadow-harvest-lg overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-parchment-shadow"
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.index}
                            className="p-8 md:p-10 flex flex-col justify-between min-h-[220px] hover:bg-cream-canvas transition-colors group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono font-medium text-driftwood tracking-widest">
                                    {stat.index}
                                </span>
                                <MiniBarChart heights={stat.barHeights} litCount={stat.litCount} />
                            </div>

                            <div>
                                <div className="text-4xl md:text-5xl font-bold text-ink-black mb-3 tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="text-[11px] font-semibold text-driftwood tracking-wider leading-relaxed uppercase">
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
