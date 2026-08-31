"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ShowcaseSignup } from "@/components/auth/ShowcaseSignup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (password.length < 8) {
      setAuthError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: fullName || email,
    });
    if (error) {
      const msg = error.message ?? "Registration failed";
      setAuthError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }
    toast.success("Account created — enter the code we emailed you.");
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthLayout showcase={<ShowcaseSignup />}>
      <div className="flex flex-col space-y-5">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b997ff]/15 border border-[#b997ff]/30 text-[10px] font-mono text-[#b997ff] mb-2.5">
            <ShieldCheck className="size-3 text-[#00f575]" />
            <span>Zero-Knowledge Setup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f0ec] mb-1.5">
            Create Your{" "}
            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
              Vault
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#d0c9c4] leading-relaxed">
            Instant 5 GB encrypted storage. Client-side privacy guaranteed.
          </p>
        </div>

        <form
          className="space-y-3.5 animate-fade-in-up stagger-1"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Alex Chen"
              className="bg-white/[0.04] border-parchment-shadow hover:border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood h-11 rounded-xl px-4 transition-all duration-200"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="you@company.com"
              className="bg-white/[0.04] border-parchment-shadow hover:border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood h-11 rounded-xl px-4 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
              Password
            </label>
            <PasswordInput
              placeholder="Min. 8 characters"
              className="bg-white/[0.04] border-parchment-shadow hover:border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood h-11 rounded-xl px-4 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <PasswordStrengthMeter password={password} />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a5a2a5]">
              Confirm Password
            </label>
            <PasswordInput
              placeholder="Repeat your password"
              className="bg-white/[0.04] border-parchment-shadow hover:border-parchment-shadow focus:border-[#b997ff] text-[#f1f0ec] placeholder-driftwood h-11 rounded-xl px-4 transition-all duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {authError && (
            <p className="text-xs text-[#ff5632] bg-[#ff5632]/10 border border-[#ff5632]/25 rounded-xl px-3.5 py-2.5 font-mono">
              {authError}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl font-bold mt-2 bg-[#00f575] hover:bg-[#00f575]/90 text-black shadow-[0_0_20px_rgba(0,245,117,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? "Generating Encryption Keys…" : "Initialize Vault & Get Started"}
            {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
          </Button>

          <p className="text-[11px] text-[#a5a2a5] text-center leading-relaxed">
            By creating an account you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-[#b997ff] transition-colors cursor-pointer"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-[#b997ff] transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <p className="text-center text-[#d0c9c4] text-xs sm:text-sm animate-fade-in-up stagger-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#00f575] font-semibold hover:underline cursor-pointer"
          >
            Sign in
          </Link>
        </p>

      </div>
    </AuthLayout>
  );
}

