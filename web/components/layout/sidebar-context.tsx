"use client"

import * as React from "react"

import { useIsMobile } from "@/hooks/use-mobile"

const STORAGE_KEY = "silo-sidebar-collapsed"

type SidebarLayoutContextValue = {
  collapsed: boolean
  toggleCollapsed: () => void
  isMobile: boolean
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const SidebarLayoutContext = React.createContext<SidebarLayoutContextValue | null>(null)

export function SidebarLayoutProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  // Starts false on both server and first client render (so hydration
  // matches), then flips one frame after mount once localStorage is safe
  // to read.
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const toggleCollapsed = React.useCallback(() => {
    if (isMobile) {
      setMobileOpen((open) => !open)
      return
    }
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
      return next
    })
  }, [isMobile])

  const value = React.useMemo(
    () => ({ collapsed: isMobile ? false : collapsed, toggleCollapsed, isMobile, mobileOpen, setMobileOpen }),
    [collapsed, toggleCollapsed, isMobile, mobileOpen],
  )

  return <SidebarLayoutContext.Provider value={value}>{children}</SidebarLayoutContext.Provider>
}

export function useSidebarLayout() {
  const context = React.useContext(SidebarLayoutContext)
  if (!context) {
    throw new Error("useSidebarLayout must be used within a SidebarLayoutProvider.")
  }
  return context
}
