"use client";

import { useEffect } from "react";
import { useAnimate, stagger } from "motion/react";
import { KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { SilviOrb } from "@/components/assistant/silvi-orb";

const STEPS = [
  { label: "PRIOR KEY DERIVATION", val: "8e3f…c91a", done: true },
  { label: "ROTATED AES-256 HASH", val: "2d7b…f40e", active: true },
];

export function ShowcaseResetPassword() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const easeOut = [0.22, 1, 0.36, 1] as const;

    animate(".srp-top", { opacity: 1, y: 0 }, { duration: 0.4, delay: 0.2, ease: easeOut });
    animate(".srp-heading", { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.35, ease: easeOut });
    animate(
      ".srp-step",
      { opacity: 1, y: 0 },
      { duration: 0.45, delay: stagger(0.08, { startDelay: 0.5 }), ease: easeOut },
    );
    animate(".srp-bar-fill", { scaleX: 1 }, { duration: 0.7, delay: 0.8, ease: "easeOut" });
    animate(
      ".srp-float",
      { opacity: 1, y: 0, rotate: 0 },
      { duration: 0.5, delay: 1.0, ease: "backOut" },
    );

    animate(".srp-spin", { rotate: 360 }, { duration: 3, repeat: Infinity, ease: "linear", delay: 0.6 });
  }, [animate]);

  return (
    <div ref={scope} className="relative w-full flex flex-col gap-3.5 xl:gap-4">
      {/* Silvi Security Sentinel Card */}
      <div className="bg-[#2d2734]/85 backdrop-blur-xl border border-parchment-shadow p-4 xl:p-4.5 rounded-2xl flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <SilviOrb status="processing" size={38} showGlow showRings interactive={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#f1f0ec]">Passphrase Key Rotation</span>
              <span className="px-2 py-0.5 rounded-full bg-[#b997ff]/15 border border-[#b997ff]/30 text-[#b997ff] text-[9px] font-mono font-bold flex items-center gap-1">
                <RefreshCw className="srp-spin size-2.5" />
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#d0c9c4] mt-0.5 font-mono">
              Re-encrypting local metadata keys
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#2d2734]/85 backdrop-blur-2xl border border-parchment-shadow p-5 xl:p-6 rounded-3xl w-full relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 size-48 bg-[#b997ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top row */}
        <div className="srp-top flex items-center justify-between mb-4 opacity-0 translate-y-2">
          <div className="size-10 rounded-xl bg-white/[0.04] border border-parchment-shadow flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#00f575]" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f575]/10 border border-[#00f575]/25 text-[#00f575] text-[10px] font-mono font-bold">
            <div className="size-1.5 rounded-full bg-[#00f575] animate-pulse" />
            SYNCHRONIZED
          </div>
        </div>

        {/* Heading */}
        <h2 className="srp-heading text-2xl xl:text-3xl font-bold text-[#f1f0ec] leading-tight mb-3 tracking-tight opacity-0 translate-y-2">
          Vault Re-Keying{" "}
          <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
            in Progress.
          </span>
        </h2>

        {/* Hash steps */}
        <div className="space-y-2 mb-4 xl:mb-5 w-full">
          {STEPS.map(({ label, val, done, active }) => (
            <div
              key={label}
              className="srp-step flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-parchment-shadow opacity-0 translate-y-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`size-2 rounded-full shrink-0 ${
                    done ? "bg-[#00f575]" : active ? "bg-[#b997ff] animate-pulse" : "bg-marigold-glow/50"
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-[9px] font-mono tracking-wider text-[#a5a2a5] uppercase mb-0.5">
                    {label}
                  </div>
                  <div className="font-mono text-xs text-[#f1f0ec] truncate">{val}</div>
                </div>
              </div>
              {done && <ShieldCheck className="w-4 h-4 text-[#00f575] shrink-0" />}
            </div>
          ))}
        </div>

        {/* Strength bar */}
        <div className="space-y-1.5 w-full">
          <div className="flex justify-between text-[10px] font-mono tracking-wider uppercase">
            <span className="text-[#a5a2a5]">ENTROPY STRENGTH</span>
            <span className="text-[#00f575] font-bold">SHIELD ARMED</span>
          </div>
          <div className="h-1.5 w-full bg-marigold-glow/40 rounded-full overflow-hidden">
            <div
              className="srp-bar-fill h-full rounded-full bg-gradient-to-r from-[#b997ff] to-[#00f575] origin-left scale-x-0"
              style={{ width: "95%" }}
            />
          </div>
        </div>
      </div>

      {/* Floating Verification Badge */}
      <div className="srp-float bg-[#2d2734]/90 border border-[#00f575]/30 px-3.5 py-2.5 rounded-2xl flex items-center justify-between opacity-0 translate-y-2 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-xl bg-[#00f575]/15 flex items-center justify-center border border-[#00f575]/30 shrink-0">
            <ShieldCheck className="size-3.5 text-[#00f575]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#f1f0ec]">Access Token Restored</div>
            <div className="text-[10px] text-[#a5a2a5] font-mono">Client-side signature verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}



