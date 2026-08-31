"use client";

import { useEffect } from "react";
import { useAnimate, stagger } from "motion/react";
import { Zap, Shield, Share2, Lock, Bell, CheckCircle2 } from "lucide-react";
import { SilviOrb } from "@/components/assistant/silvi-orb";

const FEATURES = [
  {
    icon: Zap,
    title: "Direct S3 Acceleration",
    desc: "Presigned direct cloud transfers with zero server bottlenecks.",
    tag: "10 Gbps",
    color: "text-harvest-flame bg-marigold-glow border-harvest-flame/25",
  },
  {
    icon: Shield,
    title: "Zero-Knowledge Cipher",
    desc: "AES-256-GCM encrypted at rest with client-derived private keys.",
    tag: "AES-256",
    color: "text-ink-black bg-parchment-shadow/40 border-parchment-shadow",
  },
  {
    icon: Share2,
    title: "Instant Revocable Sharing",
    desc: "Generate timed grant links or revoke file access with 1-click.",
    tag: "Instant",
    color: "text-harvest-flame bg-marigold-glow border-harvest-flame/25",
  },
];

const ALERTS = [
  { time: "Just now", msg: "vault-init.key generated & sealed", status: "SEALED", color: "text-harvest-flame bg-marigold-glow border-harvest-flame/20" },
  { time: "2m ago", msg: "Silvi AI agent attached to workspace", status: "ACTIVE", color: "text-ink-black bg-parchment-shadow/40 border-parchment-shadow" },
  { time: "5m ago", msg: "Zero-knowledge handshake verified", status: "VERIFIED", color: "text-harvest-flame bg-marigold-glow border-harvest-flame/20" },
];

export function ShowcaseSignup() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const easeOut = [0.22, 1, 0.36, 1] as const;

    animate(".ss-badge", { opacity: 1, y: 0 }, { duration: 0.4, delay: 0.2, ease: easeOut });
    animate(".ss-heading", { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.35, ease: easeOut });
    animate(
      ".ss-feature",
      { opacity: 1, y: 0 },
      { duration: 0.45, delay: stagger(0.08, { startDelay: 0.5 }), ease: easeOut },
    );
    animate(".ss-divider", { scaleX: 1 }, { duration: 0.5, delay: 0.8, ease: "easeOut" });
    animate(
      ".ss-alert",
      { opacity: 1, y: 0 },
      { duration: 0.4, delay: stagger(0.06, { startDelay: 0.95 }), ease: easeOut },
    );
    animate(".ss-proof", { opacity: 1, y: 0 }, { duration: 0.4, delay: 1.15, ease: easeOut });
  }, [animate]);

  return (
    <div ref={scope} className="relative w-full flex flex-col gap-3.5 xl:gap-4">
      {/* Top Silvi Live Banner */}
      <div className="bg-white border border-parchment-shadow p-4 xl:p-4.5 rounded-2xl flex items-center justify-between shadow-harvest-sm">
        <div className="flex items-center gap-3">
          <SilviOrb status="idle" size={38} showGlow showRings interactive={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink-black">Create Your Encrypted Vault</span>
              <span className="px-2 py-0.5 rounded-full bg-marigold-glow border border-harvest-flame/30 text-harvest-flame text-[9px] font-mono font-bold">
                5 GB FREE
              </span>
            </div>
            <p className="text-[11px] text-warm-stone mt-0.5">
              Zero credit card required · Instant setup
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-marigold-glow border border-harvest-flame/25 text-harvest-flame text-[10px] font-mono font-bold">
          <CheckCircle2 className="size-3" />
          <span>READY</span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="card-harvest rounded-3xl p-5 xl:p-6 w-full relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -bottom-16 -left-16 size-48 bg-marigold-glow/60 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="ss-badge inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-marigold-glow border border-harvest-flame/25 mb-3 opacity-0 translate-y-2">
          <div className="size-1.5 rounded-full bg-harvest-flame animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-harvest-flame">
            SYSTEM INTEGRITY: SECURED
          </span>
        </div>

        {/* Heading */}
        <h2 className="ss-heading text-2xl xl:text-3xl font-bold leading-tight mb-4 text-ink-black tracking-tight opacity-0 translate-y-2">
          Your private vault,{" "}
          <span className="text-harvest-flame">
            organized and protected.
          </span>
        </h2>

        {/* Full-width balanced feature cards */}
        <div className="space-y-2.5 mb-4 xl:mb-5 w-full">
          {FEATURES.map(({ icon: Icon, title, desc, tag, color }) => (
            <div
              key={title}
              className="ss-feature w-full p-3 rounded-2xl bg-cream-canvas border border-parchment-shadow hover:border-harvest-flame/40 transition-all flex items-center justify-between gap-3 opacity-0 translate-y-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={"shrink-0 size-8 rounded-xl flex items-center justify-center border " + color}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-ink-black leading-none mb-1">{title}</div>
                  <p className="text-[11px] text-warm-stone truncate leading-tight">{desc}</p>
                </div>
              </div>
              <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white border border-parchment-shadow text-driftwood">
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="ss-divider h-px bg-parchment-shadow mb-4 origin-left scale-x-0" />

        {/* Real-time signals feed */}
        <div className="mb-3.5 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-3 h-3 text-harvest-flame" />
              <span className="text-[10px] font-mono tracking-wider uppercase text-driftwood">
                Real-time Vault Signals
              </span>
            </div>
            <span className="text-[9px] font-mono text-harvest-flame">LIVE STREAM</span>
          </div>

          <div className="space-y-1.5 w-full">
            {ALERTS.map((alert, i) => (
              <div
                key={i}
                className="ss-alert flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-cream-canvas border border-parchment-shadow opacity-0 translate-y-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-1.5 rounded-full bg-harvest-flame shrink-0" />
                  <span className="text-[11px] text-ink-black font-mono truncate">{alert.msg}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold border ${alert.color}`}>
                    {alert.status}
                  </span>
                  <span className="text-[9px] font-mono text-driftwood">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy reassurance */}
        <div className="ss-proof flex items-center gap-2 pt-3 border-t border-parchment-shadow opacity-0 translate-y-2">
          <div className="size-5 rounded-full bg-marigold-glow border border-harvest-flame/25 flex items-center justify-center shrink-0">
            <Lock className="size-2.5 text-harvest-flame" />
          </div>
          <span className="text-[10px] text-warm-stone leading-snug">
            Private by default — only you hold access unless you generate a share token.
          </span>
        </div>
      </div>
    </div>
  );
}
