import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create your free Silo account and start storing and sharing files in minutes. No credit card required.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
