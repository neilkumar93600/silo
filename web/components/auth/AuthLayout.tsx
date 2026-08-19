import { Logo } from "@/components/shared/logo";
import { GSAPShowcase } from "./GSAPShowcase";

interface AuthLayoutProps {
  children: React.ReactNode;
  showcase: React.ReactNode;
}

export function AuthLayout({ children, showcase }: AuthLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-2 bg-background lg:h-screen">
      {/* Left: Showcase — no overflow-hidden so floating cards aren't clipped */}
      <div className="hidden lg:flex relative flex-col items-center justify-center border-r border-border/50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/auth-artwork.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/35" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />

        {/* Showcase content */}
        <div className="relative z-10 w-full max-w-lg px-10 py-8">
          <GSAPShowcase>{showcase}</GSAPShowcase>
        </div>

        {/* Watermark */}
        <div className="absolute bottom-8 left-8 z-10 text-lg font-semibold tracking-tight opacity-20 select-none uppercase">
          Silo
        </div>
      </div>

      {/* Right: Auth Form — centered on all screen sizes */}
      <div className="flex items-start justify-center min-h-screen lg:min-h-0 overflow-y-auto px-4 pt-10 pb-10 sm:px-6 lg:px-12 lg:items-center relative z-10">
        <div className="w-full max-w-[480px]">
          {/* Logo */}
          <div className="mb-8 animate-fade-in-up flex items-center justify-center gap-2.5">
            <Logo className="h-8 w-auto text-foreground" />
            <span className="text-3xl font-freckle tracking-wide">Silo</span>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 animate-fade-in-scale stagger-1 relative">
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}