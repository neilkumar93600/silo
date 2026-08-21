"use client";

import { useEffect } from "react";
import { useAnimate, stagger } from "motion/react";
import { ShieldCheck, KeyRound } from "lucide-react";
import { SilviOrb } from "@/components/assistant/silvi-orb";

const SEC_METRICS = [
  { label: "Cipher", val: "AES-256-GCM" },
  { label: "Zero-Knowledge", val: "Verified" },
];

export function ShowcaseForgotPassword() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const easeOut = [0.22, 1, 0.36, 1] as const;

    animate(".sfp-top", { opacity: 1, y: 0 }, { duration: 0.4, delay: 0.2, ease: easeOut });
    animate(".sfp-heading", { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.35, ease: easeOut });
    animate(".sfp-body", { opacity: 1, y: 0 }, { duration: 0.45, delay: 0.5, ease: easeOut });
    animate(
      ".sfp-metric",
      { opacity: 1, y: 0 },
      { duration: 0.45, delay: stagger(0.08, { startDelay: 0.65 }), ease: easeOut },
    );
    animate(".sfp-bar-fill", { scaleX: 1 }, { duration: 0.7, delay: 0.9, ease: "easeOut" });
    animate(
      ".sfp-float",
      { opacity: 1, y: 0, rotate: 0 },
      { duration: 0.5, delay: 1.1, ease: "backOut" },
    );
  }, [animate]);

  return (
    <div ref={scope} className="relative w-full flex flex-col gap-3.5 xl:gap-4">
      {/* Silvi Security Sentinel Card */}
      <div className="bg-[#2d2734]/85 backdrop-blur-xl border border-white/15 p-4 xl:p-4.5 rounded-2xl flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3">
          <SilviOrb status="checking" size={38} showGlow showRings interactive={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#f1f0ec]">Passphrase Recovery Shield</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00f575]/15 border border-[#00f575]/30 text-[#00f575] text-[9px] font-mono font-bold">
                ENCRYPTED
              </span>
            </div>
            <p className="text-[11px] text-[#d0c9c4] mt-0.5 font-mono">
              Signed cryptographic token protocol
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#2d2734]/85 backdrop-blur-2xl border border-white/15 p-5 xl:p-6 rounded-3xl w-full relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 size-48 bg-[#b997ff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top row */}
        <div className="sfp-top flex items-center justify-between mb-4 opacity-0 translate-y-2">
          <div className="size-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#b997ff]" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f575]/10 border border-[#00f575]/25 text-[#00f575] text-[10px] font-mono font-bold">
            <div className="size-1.5 rounded-full bg-[#00f575] animate-pulse" />
            GUARDED
          </div>
        </div>

        {/* Heading */}
        <h2 className="sfp-heading text-2xl xl:text-3xl font-bold text-[#f1f0ec] leading-tight mb-2.5 tracking-tight opacity-0 translate-y-2">
          Protect your{" "}
          <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
            encryption keys.
          </span>
        </h2>

        {/* Body */}
        <p className="sfp-body text-xs text-[#d0c9c4] leading-relaxed mb-4 opacity-0 translate-y-2">
          Every file is client-side encrypted at rest with AES-256-GCM. We never store raw keys or credentials on servers.
        </p>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 xl:mb-5 w-full">
          {SEC_METRICS.map(({ label, val }) => (
            <div key={label} className="sfp-metric p-3 rounded-2xl bg-white/[0.03] border border-white/10 opacity-0 translate-y-2">
              <div className="text-[9px] font-mono tracking-wider text-[#a5a2a5] uppercase mb-0.5">
                {label}
              </div>
              <div className="font-bold text-sm text-[#f1f0ec]">{val}</div>
            </div>
          ))}
        </div>

        {/* Vault status bar */}
        <div className="space-y-1.5 w-full">
          <div className="flex justify-between text-[10px] font-mono tracking-wider uppercase">
            <span className="text-[#a5a2a5]">VAULT SECURITY STATUS</span>
            <span className="text-[#00f575] font-bold">OPTIMAL</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="sfp-bar-fill h-full rounded-full bg-gradient-to-r from-[#b997ff] to-[#00f575] origin-left scale-x-0"
              style={{ width: "94%" }}
            />
          </div>
        </div>
      </div>

      {/* Floating Verification Badge */}
      <div className="sfp-float bg-[#2d2734]/90 border border-[#00f575]/30 px-3.5 py-2.5 rounded-2xl flex items-center justify-between opacity-0 translate-y-2 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-xl bg-[#00f575]/15 flex items-center justify-center border border-[#00f575]/30 shrink-0">
            <ShieldCheck className="size-3.5 text-[#00f575]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#f1f0ec]">Timed Recovery Link</div>
            <div className="text-[10px] text-[#a5a2a5] font-mono">Single-use cryptographically signed</div>
          </div>
        </div>
      </div>
    </div>
  );
}



