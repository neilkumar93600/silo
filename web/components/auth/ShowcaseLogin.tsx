"use client";

import { useEffect } from "react";
import { useAnimate, stagger } from "motion/react";
import { TrendingUp, ShieldCheck } from "lucide-react";

const BAR_DATA = [
  { h: 38, d: "M" },
  { h: 62, d: "T" },
  { h: 45, d: "W" },
  { h: 88, d: "T" },
  { h: 52, d: "F" },
  { h: 100, d: "S", peak: true },
  { h: 60, d: "S" },
  { h: 40, d: "M" },
];

const FILE_TYPES = [
  { name: "Images", pct: 55, color: "#8b5cf6" },
  { name: "Documents", pct: 30, color: "#3b82f6" },
  { name: "Media", pct: 15, color: "#f43f5e" },
];

export function ShowcaseLogin() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const easeOut = [0.22, 1, 0.36, 1] as const;

    animate(".sl-header", { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.6, ease: easeOut });
    animate(
      ".sl-bar",
      { scaleY: 1 },
      { duration: 0.5, delay: stagger(0.06, { startDelay: 0.8 }), ease: "backOut" },
    );
    animate(".sl-peak", { opacity: 1, y: 0 }, { duration: 0.3, delay: 1.05, ease: easeOut });
    animate(
      ".sl-provider-fill",
      { scaleX: 1 },
      { duration: 0.5, delay: stagger(0.1, { startDelay: 1.15 }), ease: "easeOut" },
    );
    animate(
      ".sl-stat",
      { opacity: 1, y: 0 },
      { duration: 0.4, delay: stagger(0.08, { startDelay: 1.55 }), ease: easeOut },
    );
    animate(
      ".sl-float",
      { opacity: 1, y: 0, rotate: 0 },
      { duration: 0.6, delay: 1.9, ease: "backOut" },
    );

    // SYNCED dot pulse — runs indefinitely
    animate(
      ".sl-live-dot",
      { scale: [1, 1.6, 1], opacity: [1, 0.35, 1] },
      { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 2.2 },
    );
  }, [animate]);

  return (
    <div ref={scope} className="relative pb-14">
      {/* Main glass card */}
      <div className="bg-card border border-border p-7 rounded-2xl w-full relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="sl-header flex items-start justify-between mb-5 opacity-0 -translate-y-3">
          <div>
            <div className="text-[9px] font-mono tracking-widest uppercase opacity-40 mb-1">
              STORAGE USAGE
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-3xl tracking-tight">2.4</span>
              <span className="text-sm text-muted-foreground font-mono">GB of 5 GB</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-emerald-400 text-[10px] font-mono font-bold">
              <TrendingUp className="w-3 h-3" />
              +180 MB this week
            </div>
          </div>

          {/* SYNCED badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold tracking-wider flex-shrink-0">
            <div className="sl-live-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SYNCED
          </div>
        </div>

        {/* Bar chart */}
        <div
          className="flex items-end justify-between gap-1.5 mb-2"
          style={{ height: 88 }}
        >
          {BAR_DATA.map((bar, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center justify-end h-full flex-1"
            >
              {bar.peak && (
                <div className="sl-peak absolute -top-5 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-primary text-white text-[7px] font-mono font-bold rounded whitespace-nowrap opacity-0 translate-y-1">
                  PEAK
                </div>
              )}
              <div
                className={`sl-bar w-full rounded-t-sm origin-bottom scale-y-0 ${bar.peak
                    ? "bg-gradient-to-t from-primary to-laser-violet shadow-[0_0_14px_rgba(185,151,255,0.4)]"
                    : "bg-white/10"
                  }`}
                style={{ height: `${bar.h}%` }}
              />
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div className="flex justify-between mb-5">
          {BAR_DATA.map((bar, i) => (
            <div key={i} className="flex-1 text-center text-[7px] font-mono opacity-25">
              {bar.d}
            </div>
          ))}
        </div>

        {/* File type breakdown */}
        <div className="space-y-2.5 mb-5">
          {FILE_TYPES.map((f) => (
            <div key={f.name} className="flex items-center gap-2">
              <div className="text-[9px] font-mono opacity-40 w-16 flex-shrink-0">
                {f.name}
              </div>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="sl-provider-fill h-full rounded-full origin-left scale-x-0"
                  style={{ width: `${f.pct}%`, backgroundColor: f.color }}
                />
              </div>
              <div className="text-[9px] font-mono opacity-40 w-7 text-right">
                {f.pct}%
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
          {[
            { label: "Total", val: "2.4 GB", cls: "" },
            { label: "Files", val: "184", cls: "" },
            { label: "Shared", val: "12", cls: "text-primary" },
          ].map(({ label, val, cls }) => (
            <div key={label} className="sl-stat opacity-0 translate-y-2">
              <div
                className={`text-[8px] font-mono tracking-wider uppercase mb-1 ${cls || "opacity-35"
                  }`}
              >
                {label}
              </div>
              <div className={`font-bold text-sm ${cls}`}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating alert card — within pb-14 zone so no overflow */}
      <div className="sl-float absolute bottom-2 right-0 bg-card border border-primary/20 px-4 py-3 rounded-xl flex gap-3 items-center opacity-0 translate-y-5 rotate-[3deg]">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center border border-primary/20 flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="text-xs font-bold leading-none mb-0.5">Files encrypted</div>
          <div className="text-[9px] text-muted-foreground font-mono">
            AES-256 at rest
          </div>
        </div>
      </div>
    </div>
  );
}
