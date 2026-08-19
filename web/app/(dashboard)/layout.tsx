import type { Metadata } from "next"
import { MotionConfig } from "motion/react"
import { SidebarLayoutProvider } from "@/components/layout/sidebar-context"
import { DriveProvider } from "@/components/layout/drive-context"
import { AssistantProvider } from "@/components/layout/assistant-context"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { UploadProgressPanel } from "@/components/layout/upload-progress-panel"
import { AssistantPanel } from "@/components/assistant/assistant-panel"
import { GlobalWindowDropzone } from "@/components/layout/global-window-dropzone"
import { CommandPalette } from "@/components/layout/command-palette"

// Authenticated app surface — never indexed, always private to the signed-in user.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <MotionConfig reducedMotion="user">
        <SidebarLayoutProvider>
          <DriveProvider>
            <AssistantProvider>
              <div className="flex min-h-svh overflow-x-hidden">
                <DashboardSidebar />
                <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden pb-24 md:pb-0">{children}</div>
                <AssistantPanel />
              </div>
              <MobileBottomNav />
              <UploadProgressPanel />
              <GlobalWindowDropzone />
              <CommandPalette />
            </AssistantProvider>
          </DriveProvider>
        </SidebarLayoutProvider>
      </MotionConfig>
    </div>
  )
}
