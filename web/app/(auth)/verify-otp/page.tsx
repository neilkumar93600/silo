"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ShowcaseSignup } from "@/components/auth/ShowcaseSignup";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, MailCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const RESEND_COOLDOWN_SECONDS = 30;

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleVerify(code: string) {
    setLoading(true);
    const { error } = await authClient.emailOtp.verifyEmail({ email, otp: code });
    if (error) {
      toast.error(error.message ?? "Invalid or expired code");
      setOtp("");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleResend() {
    if (cooldown > 0) return;
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
    if (error) {
      toast.error(error.message ?? "Could not resend code");
      return;
    }
    toast.success("New code sent — check your inbox.");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  if (!email) {
    return (
      <AuthLayout showcase={<ShowcaseSignup />}>
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f0ec] mb-2">
            Missing <span className="text-[#ff5632]">Email</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#d0c9c4] leading-relaxed">
            Open this page from the link in your verification email, or sign up again.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#a5a2a5] hover:text-[#00f575] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign up
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showcase={<ShowcaseSignup />}>
      <div className="flex flex-col space-y-6">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00f575]/10 border border-[#00f575]/25 text-[10px] font-mono text-[#00f575] mb-2.5">
            <MailCheck className="size-3" />
            <span>Check Your Inbox</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f0ec] mb-2">
            Verify Your{" "}
            <span className="bg-gradient-to-r from-[#b997ff] via-[#ff9efa] to-[#00f575] bg-clip-text text-transparent">
              Email
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#d0c9c4] leading-relaxed">
            Enter the 6-digit code sent to <span className="text-[#f1f0ec]">{email}</span>.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 animate-fade-in-up stagger-1">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={() => handleVerify(otp)}
            disabled={loading || otp.length !== 6}
            className="w-full h-12 rounded-xl font-bold bg-[#00f575] hover:bg-[#00f575]/90 text-black shadow-[0_0_20px_rgba(0,245,117,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? "Verifying…" : "Verify & Continue"}
          </Button>

          <p className="text-xs text-[#a5a2a5] text-center">
            Didn't get it?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-[#00f575] font-semibold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </p>
        </div>

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

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpContent />
    </Suspense>
  );
}
