"use client";

import { useEffect } from "react";
import { useAnimate, stagger } from "motion/react";
import { KeyRound, RefreshCw, ShieldCheck } from "lucide-react";

const STEPS = [
  { label: "OLD HASH", val: "8e3f…c91a", done: true },
  { label: "NEW HASH", val: "2d7b…f40e", active: true },
];

export function ShowcaseResetPassword() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const easeOut = [0.22, 1, 0.36, 1] as const;

    animate(".srp-top", { opacity: 1, y: 0 }, { duration: 0.5, delay: 0.6, ease: easeOut });
    animate(".srp-heading", { opacity: 1, y: 0 }, { duration: 0.6, delay: 0.9, ease: easeOut });
    animate(
      ".srp-step",
      { opacity: 1, x: 0 },
      { duration: 0.45, delay: stagger(0.12, { startDelay: 1.2 }), ease: easeOut },
    );
    animate(".srp-bar-fill", { scaleX: 1 }, { duration: 0.8, delay: 1.6, ease: "easeOut" });
    animate(
      ".srp-float",
      { opacity: 1, y: 0, rotate: 0 },
      { duration: 0.6, delay: 2.4, ease: "backOut" },
    );

    animate(".srp-spin", { rotate: 360 }, { duration: 3, repeat: Infinity, ease: "linear", delay: 1.0 });
  }, [animate]);

  return (
    <div ref={scope} className="relative pb-14">
      <div className="bg-card border border-border p-8 rounded-2xl w-full relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        {/* Top row */}
        <div className="srp-top flex items-center justify-between mb-8 opacity-0 -translate-y-3">
          <div className="w-14 h-14 rounded-2xl bg-card border border-white/5 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent" />
            <KeyRound className="w-7 h-7 text-primary relative z-10" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-mono font-bold tracking-wider">
            <RefreshCw className="srp-spin w-3 h-3" />
            ROTATING
          </div>
        </div>

        {/* Heading */}
        <h2 className="srp-heading font-serif text-5xl leading-tight mb-5 tracking-tight opacity-0 translate-y-4">
          Vault
          <br />
          <span className="font-playwrite opacity-60">re-keyed</span>
        </h2>

        {/* Hash steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map(({ label, val, done, active }) => (
            <div
              key={label}
              className="srp-step flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] opacity-0 -translate-x-5"
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  done ? "bg-emerald-400" : active ? "bg-primary animate-pulse" : "bg-white/20"
                }`}
              />
              <div className="flex-1">
                <div className="text-[9px] font-mono tracking-wider opacity-40 uppercase mb-0.5">
                  {label}
                </div>
                <div className="font-mono text-xs">{val}</div>
              </div>
              {done && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* Strength bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] font-mono tracking-wider uppercase">
            <span className="opacity-40">KEY STRENGTH</span>
            <span className="text-primary font-bold">STRONG</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="srp-bar-fill h-full rounded-full bg-gradient-to-r from-primary to-royal-plum origin-left scale-x-0"
              style={{ width: "92%" }}
            />
          </div>
        </div>
      </div>

      {/* Floating card */}
      <div className="srp-float absolute bottom-2 right-0 bg-card border border-emerald-500/20 px-4 py-3 rounded-xl flex gap-3 items-center opacity-0 translate-y-5 rotate-[2deg]">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-xs font-bold leading-none mb-0.5">Access Restored</div>
          <div className="text-[9px] text-muted-foreground font-mono">New hash generated</div>
        </div>
      </div>
    </div>
  );
}
