"use client";

import { useEffect } from "react";
import { useAnimate } from "motion/react";

export function GSAPShowcase({ children }: { children: React.ReactNode }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Entry: fade + scale + blur reveal
    animate(
      scope.current,
      { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
      { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }
    );

    // Ambient float — starts after entry completes, loops indefinitely
    animate(
      scope.current,
      { y: [0, -10, 0] },
      { duration: 4.5, ease: "easeInOut", repeat: Infinity, delay: 1.4 }
    );
  }, [animate, scope]);

  return (
    <div ref={scope} className="showcase-initial w-full">
      {children}
    </div>
  );
}
