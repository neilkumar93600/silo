"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ShowcaseForgotPassword } from "@/components/auth/ShowcaseForgotPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    // Always show success to prevent email enumeration
    setSent(true);
    setLoading(false);
  };

  return (
    <AuthLayout showcase={<ShowcaseForgotPassword />}>
      <div className="flex flex-col space-y-6">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b997ff]/15 border border-[#b997ff]/30 text-[10px] font-mono text-[#b997ff] mb-2.5">
            <KeyRound className="size-3 text-[#00f575]" />
            <span>Key Recovery Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f0ec] mb-2">
            Reset{" "}
            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
              Password
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#d0c9c4] leading-relaxed">
            {sent
              ? "Check your inbox — if that email is registered, a cryptographic reset link is on its way."
              : "Enter your verified email to receive a secure password recovery link."}
          </p>
        </div>

        {!sent ? (
          <form className="space-y-4 animate-fade-in-up stagger-1" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
                Registered Email
              </label>
              <Input
                type="email"
                placeholder="alex@company.com"
                className="bg-white/[0.04] border-parchment-shadow hover:border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood h-12 rounded-xl px-4 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold mt-2 bg-[#00f575] hover:bg-[#00f575]/90 text-black shadow-[0_0_20px_rgba(0,245,117,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {loading ? "Sending Recovery Link…" : "Send Reset Link"}
              {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>
          </form>
        ) : (
          <div className="animate-fade-in-up stagger-1">
            <div className="rounded-2xl border border-[#00f575]/30 bg-[#00f575]/10 px-5 py-4">
              <p className="text-sm text-[#00f575] font-semibold">Recovery link dispatched</p>
              <p className="text-xs text-[#d0c9c4] mt-1 leading-relaxed">
                Check your inbox and spam folders. The link remains valid for 30 minutes.
              </p>
            </div>
          </div>
        )}

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

