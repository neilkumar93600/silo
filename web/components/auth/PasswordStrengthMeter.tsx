"use client";

import { cn } from "@/lib/utils";

const LABELS = ["Too short", "Weak Entropy", "Moderate Security", "High Entropy", "Optimal Vault Shield"];
const COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-amber-500",
  "bg-harvest-flame",
  "bg-emerald-600",
];

const TEXT_COLORS = [
  "text-destructive",
  "text-destructive",
  "text-amber-600",
  "text-harvest-flame",
  "text-emerald-600",
];

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
    <div className="flex flex-col gap-1.5 pt-1">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn("h-1 flex-1 rounded-full transition-all duration-300", i < score ? COLORS[score] : "bg-marigold-glow/40")}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-driftwood">Entropy:</span>
        <span className={cn("font-bold", TEXT_COLORS[score])}>{LABELS[score]}</span>
      </div>
    </div>
  );
}

