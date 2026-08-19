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
        label: "FREE STORAGE, NO CARD REQUIRED",
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
        label: "LARGE FILES ROUTED THROUGH OUR SERVERS",
        barHeights: [30, 50, 70, 100],
        litCount: 4,
    },
];

function MiniBarChart({ heights, litCount }: { heights: number[]; litCount: number }) {
    return (
        <div className="flex items-end gap-[2px] h-4">
            {heights.map((h: number, i: number) => (
                <div
                    key={i}
                    className="w-[3px] rounded-full transition-colors duration-500"
                    style={{
                        height: h + "%",
                        backgroundColor: i < litCount ? "#b997ff" : "#e3e4e8",
                    }}
                />
            ))}
        </div>
    );
}

export default function LandingMetrics({ className }: { className?: string }) {
    return (
        <section className={"w-full bg-white py-20 font-sans " + (className || "")}>
            {/* Header Area */}
            <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight"
                >
                    What you<br />actually get.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-sm md:text-base text-gray-500 max-w-xs md:text-right leading-relaxed"
                >
                    Four things that are true about Silo today — not a roadmap, not a promise.
                </motion.p>
            </div>

            {/* Metrics Panel */}
            <div className="relative w-full overflow-hidden">
                <div className="relative py-16 md:py-24 w-full bg-gradient-to-br from-laser-violet via-[#2d2734] to-[#6b13f5]">
                    <div className="absolute inset-0 bg-black/10" />

                    {/* White Stats Panel */}
                    <div className="relative flex items-center justify-center px-8 md:px-16 lg:px-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ amount: 0.1 }}
                            transition={{ duration: 0.7 }}
                            className="bg-white w-full rounded-[20px] shadow-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100"
                        >
                            {stats.map((stat) => (
                                <div
                                    key={stat.index}
                                    className="px-8 py-12 flex flex-col justify-between min-h-[220px]"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-xs font-medium text-gray-400 tracking-widest">
                                            {stat.index}
                                        </span>
                                        <MiniBarChart heights={stat.barHeights} litCount={stat.litCount} />
                                    </div>

                                    <div>
                                        <div className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tighter">
                                            {stat.value}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 tracking-[0.15em] leading-tight uppercase">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
