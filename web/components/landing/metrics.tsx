"use client";

import { motion } from "motion/react";

const stats = [
    {
        index: "001",
        value: "100%",
        label: "PRIVATE BY DEFAULT, UNTIL YOU SHARE",
        barHeights: [40, 60, 30, 80],
        litCount: 4,
        accentColor: "#00f575",
    },
    {
        index: "002",
        value: "5 GB",
        label: "FREE ENCRYPTED STORAGE, NO CARD REQUIRED",
        barHeights: [30, 50, 80, 40],
        litCount: 4,
        accentColor: "#b997ff",
    },
    {
        index: "003",
        value: "1-click",
        label: "TO REVOKE A SHARED FILE'S ACCESS",
        barHeights: [20, 40, 60, 90],
        litCount: 4,
        accentColor: "#ff9efa",
    },
    {
        index: "004",
        value: "0",
        label: "UNENCRYPTED DATA EXPOSURE RISK",
        barHeights: [30, 50, 70, 100],
        litCount: 4,
        accentColor: "#00f575",
    },
];

function MiniBarChart({ heights, litCount, color }: { heights: number[]; litCount: number; color: string }) {
    return (
        <div className="flex items-end gap-[3px] h-5">
            {heights.map((h: number, i: number) => (
                <div
                    key={i}
                    className="w-[3px] rounded-full transition-all duration-500"
                    style={{
                        height: h + "%",
                        backgroundColor: i < litCount ? color : "rgba(255, 255, 255, 0.1)",
                    }}
                />
            ))}
        </div>
    );
}

export default function LandingMetrics({ className }: { className?: string }) {
    return (
        <section className={"w-full bg-[#1c1624] py-24 font-sans border-t border-white/[0.06] " + (className || "")}>
            {/* Header Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-xs font-semibold text-[#b997ff] tracking-wider uppercase flex items-center gap-2 mb-2">
                        <span className="size-1.5 rounded-full bg-[#00f575]" />
                        System Guarantees
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#f1f0ec] leading-tight tracking-tight">
                        What you <br />
                        <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
                            actually get.
                        </span>
                    </h2>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-sm md:text-base text-[#d0c9c4] max-w-sm md:text-right leading-relaxed"
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
                    className="bg-[#2d2734]/50 backdrop-blur-3xl border border-white/15 w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10"
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.index}
                            className="p-8 md:p-10 flex flex-col justify-between min-h-[220px] hover:bg-white/[0.02] transition-colors group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-mono font-medium text-[#a5a2a5] tracking-widest">
                                    {stat.index}
                                </span>
                                <MiniBarChart heights={stat.barHeights} litCount={stat.litCount} color={stat.accentColor} />
                            </div>

                            <div>
                                <div className="text-4xl md:text-5xl font-bold text-[#f1f0ec] mb-3 tracking-tight group-hover:text-white transition-colors">
                                    {stat.value}
                                </div>
                                <div className="text-[11px] font-semibold text-[#a5a2a5] tracking-wider leading-relaxed uppercase">
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

