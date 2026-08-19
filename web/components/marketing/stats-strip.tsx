"use client"

import { useEffect, useState } from "react"
import { motion, animate } from "motion/react"

function PercentCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [value])

  return <>{display}%</>
}

const stats = [
  {
    stat: <PercentCounter value={100} />,
    label: "Private by default — every file, until you decide otherwise",
    tint: "bg-[#b997ff]/[0.04]",
  },
  {
    stat: "5 GB",
    label: "Free storage to start, no card required",
    tint: "bg-[#b997ff]/[0.06]",
  },
  {
    stat: "1-click",
    label: "Revoke a shared file's access, anytime",
    tint: "bg-[#6b13f5]/[0.05]",
  },
]

export function StatsStrip() {
  return (
    <section className="bg-void-plum py-16 px-6">
      <div className="mx-auto max-w-[1440px] grid gap-6 sm:grid-cols-3">
        {stats.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            className={`rounded-[18px] border border-lavender-mist ${item.tint} p-7`}
          >
            <div className="font-serif text-[40px] leading-none tracking-[-0.02em] text-laser-violet">
              {item.stat}
            </div>
            <p className="mt-3 text-[14px] leading-[1.5] text-silver-smoke">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
