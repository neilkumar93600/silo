"use client";

import { useEffect } from "react";
import { useAnimate, stagger } from "motion/react";
import { Zap, Shield, Share2, Lock, Bell } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant uploads",
    desc: "Presigned transfers straight to storage — no waiting on a slow relay.",
  },
  {
    icon: Shield,
    title: "AES-256 at rest",
    desc: "Every file is encrypted in storage, always.",
  },
  {
    icon: Share2,
    title: "Share with a link",
    desc: "Flip a file public and get a shareable link instantly.",
  },
];

const ALERTS = [
  { time: "2m ago", msg: "report.pdf uploaded", type: "info" },
  { time: "14m ago", msg: "photo.jpg shared publicly", type: "action" },
  { time: "1h ago", msg: "old-draft.docx moved to trash", type: "warn" },
];

export function ShowcaseSignup() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const easeOut = [0.22, 1, 0.36, 1] as const;

    animate(".ss-badge", { opacity: 1, y: 0 }, { duration: 0.4, delay: 0.6, ease: easeOut });
    animate(".ss-heading", { opacity: 1, y: 0 }, { duration: 0.6, delay: 0.8, ease: easeOut });
    animate(
      ".ss-feature",
      { opacity: 1, x: 0 },
      { duration: 0.5, delay: stagger(0.12, { startDelay: 1.1 }), ease: easeOut },
    );
    animate(".ss-divider", { scaleX: 1 }, { duration: 0.6, delay: 1.6, ease: "easeOut" });
    animate(
      ".ss-alert",
      { opacity: 1, x: 0 },
      { duration: 0.4, delay: stagger(0.1, { startDelay: 1.8 }), ease: easeOut },
    );
    animate(".ss-proof", { opacity: 1, y: 0 }, { duration: 0.4, delay: 2.2, ease: easeOut });

    // Alert bell shimmer — periodic
    animate(
      ".ss-bell",
      { rotate: [0, 15, 0, 15, 0] },
      { duration: 0.6, repeat: Infinity, repeatDelay: 3.5, ease: "linear", delay: 2.8 },
    );
  }, [animate]);

  return (
    <div ref={scope} className="bg-card border border-border p-7 rounded-2xl w-full relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      {/* Badge */}
      <div className="ss-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 opacity-0 -translate-y-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[9px] font-mono font-bold tracking-wider text-primary">
          SYSTEM INTEGRITY: SECURED
        </span>
      </div>

      {/* Heading */}
      <h2 className="ss-heading font-serif text-4xl leading-tight mb-7 tracking-tight opacity-0 translate-y-4">
        Your files,{" "}
        <span className="font-playwrite opacity-55">organized and secure.</span>
      </h2>

      {/* Feature list */}
      <div className="space-y-5 mb-6">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="ss-feature flex gap-4 opacity-0 -translate-x-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-primary" size={18} />
            </div>
            <div>
              <div className="font-bold text-sm mb-0.5">{title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="ss-divider h-px bg-white/5 mb-5 origin-left scale-x-0" />

      {/* Recent activity feed */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="ss-bell w-3 h-3 text-primary" />
          <span className="text-[9px] font-mono tracking-wider uppercase opacity-50">
            Recent Activity
          </span>
        </div>
        <div className="space-y-2">
          {ALERTS.map((alert, i) => (
            <div
              key={i}
              className="ss-alert flex items-center gap-3 px-3 py-2 rounded-lg bg-white/3 border border-white/5 opacity-0 translate-x-4"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${alert.type === "warn"
                    ? "bg-amber-400"
                    : alert.type === "action"
                      ? "bg-primary"
                      : "bg-emerald-400"
                  }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium truncate">{alert.msg}</div>
              </div>
              <div className="text-[8px] font-mono opacity-35 flex-shrink-0">{alert.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy reassurance */}
      <div className="ss-proof flex items-center gap-2.5 pt-4 border-t border-white/5 opacity-0 translate-y-2.5">
        <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Lock className="w-3 h-3 text-primary" />
        </div>
        <span className="text-[10px] text-muted-foreground leading-snug">
          Private by default — only you can see a file unless you choose to share it.
        </span>
      </div>
    </div>
  );
}
