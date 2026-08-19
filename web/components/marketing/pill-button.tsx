import Link from "next/link"
import { cn } from "@/lib/utils"

interface PillButtonProps {
  href: string
  variant?: "filled" | "outline"
  className?: string
  children: React.ReactNode
}

// Wonder design system CTA buttons per web/DESIGN.md:
// - Filled: #b997ff laser-violet fill, bold contrasting text, hover glow
// - Ghost Outline: transparent, 1px border #44374a lavender mist, white text
export function PillButton({ href, variant = "filled", className, children }: PillButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-[9999px] px-5 py-2.5 text-[14px] font-medium leading-[1.4] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-laser-violet",
        variant === "filled"
          ? "bg-laser-violet text-white hover:bg-[#2d2734] hover:shadow-[0_4px_16px_rgba(185,151,255,0.25)] active:scale-[0.98]"
          : "border border-lavender-mist bg-transparent text-paper-white hover:border-laser-violet hover:text-laser-violet hover:bg-laser-violet/10 active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </Link>
  )
}

