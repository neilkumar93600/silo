"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ShowcaseLogin } from "@/components/auth/ShowcaseLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    setNeedsVerification(false);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      const verified = error.code !== "EMAIL_NOT_VERIFIED";
      const msg = verified ? "Invalid email or password" : "Verify your email before signing in.";
      setAuthError(msg);
      setNeedsVerification(!verified);
      toast.error(msg);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const handleResend = async () => {
    await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthLayout showcase={<ShowcaseLogin />}>
      <div className="flex flex-col space-y-6">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f575]/10 border border-[#00f575]/25 text-[10px] font-mono text-[#00f575] mb-3">
            <Lock className="size-3" />
            <span>Encrypted Session</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f0ec] mb-2">
            Access Your{" "}
            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
              Vault
            </span>
          </h1>
          <p className="text-sm text-[#d0c9c4] leading-relaxed">
            Enter your credentials to unlock client-side decrypted files.
          </p>
        </div>

        <form
          className="space-y-4 animate-fade-in-up stagger-1"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
              Email Address
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#a5a2a5] hover:text-[#b997ff] transition-colors cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              placeholder="••••••••"
              className="bg-white/[0.04] border-parchment-shadow hover:border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood h-12 rounded-xl px-4 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {authError && (
            <p className="text-xs text-[#ff5632] bg-[#ff5632]/10 border border-[#ff5632]/25 rounded-xl px-3.5 py-2.5 font-mono">
              {authError}
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleResend}
                  className="ml-2 underline underline-offset-2 hover:text-[#f1f0ec] cursor-pointer"
                >
                  Enter code
                </button>
              )}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl font-bold mt-2 bg-[#00f575] hover:bg-[#00f575]/90 text-black shadow-[0_0_20px_rgba(0,245,117,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? "Decrypting & Signing In…" : "Sign In to Vault"}
            {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
          </Button>
        </form>

        <p className="text-center text-[#d0c9c4] text-xs sm:text-sm animate-fade-in-up stagger-2">
          New to Silo?{" "}
          <Link href="/signup" className="text-[#00f575] font-semibold hover:underline cursor-pointer">
            Create an account (5 GB Free)
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

