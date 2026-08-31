"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ShowcaseResetPassword } from "@/components/auth/ShowcaseResetPassword";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { ArrowRight, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    if (error) {
      toast.error(error.message ?? "Password reset failed");
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
  };

  if (!token) {
    return (
      <AuthLayout showcase={<ShowcaseResetPassword />}>
        <div className="flex flex-col space-y-6">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f0ec] mb-2">
              Link{" "}
              <span className="text-[#ff5632]">Expired</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#d0c9c4] leading-relaxed">
              This reset token is invalid or has expired. Request a fresh cryptographic recovery link.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 rounded-xl bg-[#00f575] hover:bg-[#00f575]/90 px-6 h-12 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,245,117,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer w-fit animate-fade-in-up stagger-1"
          >
            Request New Link
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-center animate-fade-in-up stagger-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#a5a2a5] hover:text-[#00f575] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showcase={<ShowcaseResetPassword />}>
      <div className="flex flex-col space-y-6">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f575]/10 border border-[#00f575]/25 text-[10px] font-mono text-[#00f575] mb-2.5">
            <KeyRound className="size-3" />
            <span>Key Rotation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f0ec] mb-2">
            Set New{" "}
            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
              Password
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#d0c9c4] leading-relaxed">
            {done
              ? "Your encryption passphrase has been successfully rotated."
              : "Choose a high-entropy passphrase to secure your private vault."}
          </p>
        </div>

        {!done ? (
          <form className="space-y-4 animate-fade-in-up stagger-1" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
                New Passphrase
              </label>
              <PasswordInput
                placeholder="Min. 8 characters"
                className="bg-white/[0.04] border-parchment-shadow hover:border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood h-12 rounded-xl px-4 transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
                Confirm Passphrase
              </label>
              <PasswordInput
                placeholder="Repeat your password"
                className="bg-white/[0.04] border-parchment-shadow hover:border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood h-12 rounded-xl px-4 transition-all duration-200"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold mt-2 bg-[#00f575] hover:bg-[#00f575]/90 text-black shadow-[0_0_20px_rgba(0,245,117,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {loading ? "Re-keying Vault…" : "Update Password & Re-key"}
              {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 animate-fade-in-up stagger-1">
            <div className="rounded-2xl border border-[#00f575]/30 bg-[#00f575]/10 px-5 py-4">
              <p className="text-sm text-[#00f575] font-semibold">Passphrase successfully updated</p>
              <p className="text-xs text-[#d0c9c4] mt-1 leading-relaxed">
                You can now unlock your encrypted vault with your new credentials.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 w-full justify-center rounded-xl bg-[#00f575] hover:bg-[#00f575]/90 h-12 text-sm font-bold text-black shadow-[0_0_20px_rgba(0,245,117,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Sign in now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!done && (
          <p className="text-center animate-fade-in-up stagger-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#a5a2a5] hover:text-[#00f575] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

