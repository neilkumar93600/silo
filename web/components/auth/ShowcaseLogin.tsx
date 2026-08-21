"use client";

import { useEffect } from "react";
import { useAnimate, stagger } from "motion/react";
import { TrendingUp, ShieldCheck, HardDrive } from "lucide-react";
import { SilviOrb } from "@/components/assistant/silvi-orb";

const BAR_DATA = [
  { h: 38, d: "MON" },
  { h: 62, d: "TUE" },
  { h: 45, d: "WED" },
  { h: 88, d: "THU" },
  { h: 52, d: "FRI" },
  { h: 100, d: "SAT", peak: true },
  { h: 65, d: "SUN" },
];

const FILE_TYPES = [
  { name: "Encrypted Videos", pct: 55, color: "#b997ff" },
  { name: "Private Documents", pct: 30, color: "#00f575" },
  { name: "Archives & Raw", pct: 15, color: "#ff9efa" },
];

export function ShowcaseLogin() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const easeOut = [0.22, 1, 0.36, 1] as const;

    animate(".sl-header", { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.3, ease: easeOut });
    animate(
      ".sl-bar",
      { scaleY: 1 },
      { duration: 0.5, delay: stagger(0.05, { startDelay: 0.5 }), ease: "backOut" },
    );
    animate(".sl-peak", { opacity: 1, y: 0 }, { duration: 0.3, delay: 0.8, ease: easeOut });
    animate(
      ".sl-provider-fill",
      { scaleX: 1 },
      { duration: 0.5, delay: stagger(0.08, { startDelay: 0.9 }), ease: "easeOut" },
    );
    animate(
      ".sl-stat",
      { opacity: 1, y: 0 },
      { duration: 0.4, delay: stagger(0.06, { startDelay: 1.1 }), ease: easeOut },
    );
    animate(
      ".sl-float",
      { opacity: 1, y: 0, rotate: 0 },
      { duration: 0.6, delay: 1.3, ease: "backOut" },
    );
  }, [animate]);

  return (
    <div ref={scope} className="relative w-full flex flex-col gap-3.5 xl:gap-4">
      {/* Silvi Security Sentinel Card */}
      <div className="bg-[#2d2734]/85 backdrop-blur-xl border border-white/15 p-4 xl:p-4.5 rounded-2xl flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <SilviOrb status="idle" size={38} showGlow showRings interactive={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#f1f0ec]">Silvi AI Sentinel</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00f575]/15 border border-[#00f575]/30 text-[#00f575] text-[9px] font-mono font-bold">
                ARMED
              </span>
            </div>
            <p className="text-[11px] text-[#d0c9c4] mt-0.5 font-mono">
              Zero-knowledge client encryption active
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-[10px] font-mono text-[#a5a2a5]">LATENCY</span>
          <span className="text-xs font-mono font-bold text-[#00f575]">18ms (direct)</span>
        </div>
      </div>

      {/* Main Telemetry & Storage Vault Card */}
      <div className="bg-[#2d2734]/85 backdrop-blur-2xl border border-white/15 p-5 xl:p-6 rounded-3xl w-full relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        {/* Ambient Glow */}
        <div className="absolute -top-16 -right-16 size-48 bg-[#b997ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="sl-header flex items-start justify-between mb-4 xl:mb-5 opacity-0 -translate-y-3">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#a5a2a5] mb-0.5 flex items-center gap-1.5">
              <HardDrive className="size-3 text-[#b997ff]" />
              ENCRYPTED VAULT CAPACITY
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-2xl xl:text-3xl text-[#f1f0ec] tracking-tight">2.4</span>
              <span className="text-xs text-[#a5a2a5] font-mono">GB of 5 GB FREE</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[#00f575] text-[10px] font-mono font-bold">
              <TrendingUp className="w-3 h-3" />
              +180 MB direct transfer today
            </div>
          </div>

          {/* Real-time Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f575]/10 border border-[#00f575]/25 text-[#00f575] text-[10px] font-mono font-bold tracking-wider shrink-0">
            <span className="size-1.5 rounded-full bg-[#00f575] animate-pulse" />
            SYNCHRONIZED
          </div>
        </div>

        {/* Bar chart */}
        <div
          className="flex items-end justify-between gap-2 mb-1.5 pt-1"
          style={{ height: 68 }}
        >
          {BAR_DATA.map((bar, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center justify-end h-full flex-1"
            >
              {bar.peak && (
                <div className="sl-peak absolute -top-4 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#00f575] text-black text-[8px] font-mono font-bold rounded whitespace-nowrap opacity-0 translate-y-1">
                  PEAK
                </div>
              )}
              <div
                className={`sl-bar w-full rounded-t-sm origin-bottom scale-y-0 transition-all ${
                  bar.peak
                    ? "bg-gradient-to-t from-[#6b13f5] to-[#00f575] shadow-[0_0_14px_rgba(0,245,117,0.4)]"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                style={{ height: `${bar.h}%` }}
              />
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div className="flex justify-between mb-4">
          {BAR_DATA.map((bar, i) => (
            <div key={i} className="flex-1 text-center text-[8px] font-mono text-[#a5a2a5]">
              {bar.d}
            </div>
          ))}
        </div>

        {/* File type breakdown */}
        <div className="space-y-2 mb-4 xl:mb-5">
          {FILE_TYPES.map((f) => (
            <div key={f.name} className="flex items-center gap-3">
              <div className="text-[10px] font-mono text-[#d0c9c4] w-28 shrink-0">
                {f.name}
              </div>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="sl-provider-fill h-full rounded-full origin-left scale-x-0"
                  style={{ width: `${f.pct}%`, backgroundColor: f.color }}
                />
              </div>
              <div className="text-[10px] font-mono text-[#a5a2a5] w-8 text-right">
                {f.pct}%
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t border-white/10">
          {[
            { label: "Total Usage", val: "2.4 GB", color: "text-[#f1f0ec]" },
            { label: "Encrypted Files", val: "184", color: "text-[#b997ff]" },
            { label: "Public Shares", val: "12", color: "text-[#00f575]" },
          ].map(({ label, val, color }) => (
            <div key={label} className="sl-stat opacity-0 translate-y-2">
              <div className="text-[9px] font-mono tracking-wider uppercase mb-0.5 text-[#a5a2a5]">
                {label}
              </div>
              <div className={`font-bold text-sm ${color}`}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Verification Badge */}
      <div className="sl-float bg-[#2d2734]/90 border border-[#00f575]/30 px-3.5 py-2.5 rounded-2xl flex items-center justify-between opacity-0 translate-y-2 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-xl bg-[#00f575]/15 flex items-center justify-center border border-[#00f575]/30 shrink-0">
            <ShieldCheck className="size-3.5 text-[#00f575]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#f1f0ec]">AES-256-GCM Cryptographic Seal</div>
            <div className="text-[10px] text-[#a5a2a5] font-mono">Zero raw server key storage</div>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold text-[#00f575] uppercase px-2 py-0.5 rounded bg-[#00f575]/10 border border-[#00f575]/20">
          Verified
        </span>
      </div>
    </div>
  );
}


