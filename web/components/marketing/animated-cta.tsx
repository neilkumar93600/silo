"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function AnimatedCta({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={href} className="inline-block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.span
        layout
        className={cn(
          "flex h-14 cursor-pointer items-center gap-3 rounded-full bg-primary text-primary-foreground transition-colors duration-300 hover:bg-primary/90",
          hovered ? "flex-row-reverse pl-2 pr-5" : "flex-row pl-5 pr-2",
          className
        )}
      >
        <motion.span layout className="whitespace-nowrap text-[15px] font-medium">
          {children}
        </motion.span>
        <motion.span layout className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          <motion.span
            animate={{ x: hovered ? [-16, 0] : 0, opacity: hovered ? [0, 1] : 1 }}
            transition={{ duration: 0.3, delay: hovered ? 0.1 : 0 }}
            className="flex items-center justify-center"
          >
            <ArrowUpRightIcon className="size-4 text-primary-foreground" />
          </motion.span>
        </motion.span>
      </motion.span>
    </Link>
  )
}
