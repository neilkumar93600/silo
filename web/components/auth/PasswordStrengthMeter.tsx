"use client";

import { cn } from "@/lib/utils";

const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const COLORS = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-amber-400", "bg-emerald-500"];

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

export function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;

  const score = scorePassword(password);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn("h-1 flex-1 rounded-full transition-colors", i < score ? COLORS[score] : "bg-white/10")}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">{LABELS[score]}</p>
    </div>
  );
}
