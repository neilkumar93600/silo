import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Starts false on both server and first client render (so hydration
  // matches), then flips one frame after mount once window is safe to read.
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    const raf = requestAnimationFrame(onChange)
    mql.addEventListener("change", onChange)
    return () => {
      cancelAnimationFrame(raf)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return isMobile
}
