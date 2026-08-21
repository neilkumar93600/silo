"use client";

import { cn } from "@/lib/utils";

const LABELS = ["Too short", "Weak Entropy", "Moderate Security", "High Entropy", "Optimal Vault Shield"];
const COLORS = [
  "bg-[#ff5632] shadow-[0_0_8px_#ff5632]",
  "bg-[#ff5632] shadow-[0_0_8px_#ff5632]",
  "bg-[#ff9efa] shadow-[0_0_8px_#ff9efa]",
  "bg-[#b997ff] shadow-[0_0_8px_#b997ff]",
  "bg-[#00f575] shadow-[0_0_8px_#00f575]",
];

const TEXT_COLORS = [
  "text-[#ff5632]",
  "text-[#ff5632]",
  "text-[#ff9efa]",
  "text-[#b997ff]",
  "text-[#00f575]",
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
            className={cn("h-1 flex-1 rounded-full transition-all duration-300", i < score ? COLORS[score] : "bg-white/10")}
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span className="text-[#a5a2a5]">Entropy:</span>
        <span className={cn("font-bold", TEXT_COLORS[score])}>{LABELS[score]}</span>
      </div>
    </div>
  );
}

