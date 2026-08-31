"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogOutIcon, HelpCircleIcon, Trash2Icon } from "lucide-react"

import { authClient, useSession } from "@/lib/auth-client"
import { getNotificationPreferences, updateNotificationPreferences, clearFileCache, type NotificationPreferences } from "@/lib/api"
import { cn } from "@/lib/utils"
import { DashboardTopbar } from "@/components/layout/dashboard-topbar"
import { MobileSettings } from "@/components/dashboard/mobile-settings"
import { StorageBreakdown } from "@/components/dashboard/storage-breakdown"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

function initialsOf(name: string | undefined) {
  if (!name) return "?"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

type TabKey = "account" | "notifications" | "storage" | "help"

const TABS: { key: TabKey; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "notifications", label: "Notifications" },
  { key: "storage", label: "Storage" },
  { key: "help", label: "Help & Support" },
]

function ProfileCard() {
  const router = useRouter()
  const { data: session } = useSession()
  const [name, setName] = useState(session?.user?.name ?? "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session?.user?.name) return
    const raf = requestAnimationFrame(() => setName(session.user.name))
    return () => cancelAnimationFrame(raf)
  }, [session?.user?.name])

  async function saveName() {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error("Name can't be empty")
      return
    }
    setSaving(true)
    const { error } = await authClient.updateUser({ name: trimmed })
    setSaving(false)
    if (error) {
      toast.error(error.message ?? "Could not update name")
      return
    }
    toast.success("Name updated")
    router.refresh()
  }

  const unchanged = name.trim() === (session?.user?.name ?? "").trim()

  return (
    <Card className="max-w-2xl border border-lavender-mist bg-eclipse-black text-ink-black">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-semibold tracking-[-0.03em] text-ink-black">Account Vault</CardTitle>
        <CardDescription className="text-silver-smoke">Your Silo identity and encryption scope.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-6 pt-0">
        <div className="flex items-center gap-4 rounded-xl border border-lavender-mist/60 bg-cream-canvas p-4">
          <Avatar className="size-12 shrink-0 border border-lavender-mist">
            <AvatarFallback className="bg-carbon-ink text-sm font-mono font-bold text-laser-violet">
              {initialsOf(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-ink-black">{session?.user?.name ?? "…"}</p>
            <p className="truncate font-mono text-xs text-ash-wisp">{session?.user?.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display-name" className="text-silver-smoke">
            Display name
          </Label>
          <div className="flex gap-2">
            <Input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-lavender-mist bg-cream-canvas text-ink-black"
            />
            <Button onClick={saveName} disabled={saving || unchanged} className="shrink-0">
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-fit border-lavender-mist bg-cream-canvas text-silver-smoke hover:border-laser-violet hover:text-laser-violet"
          onClick={async () => {
            await authClient.signOut()
            clearFileCache()
            router.push("/login")
            router.refresh()
          }}
        >
          <LogOutIcon data-icon="inline-start" />
          Sign out
        </Button>
      </CardContent>
    </Card>
  )
}

function PasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)

  async function savePassword() {
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    setSaving(true)
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })
    setSaving(false)
    if (error) {
      toast.error(error.message ?? "Could not change password")
      return
    }
    toast.success("Password updated")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <Card className="max-w-2xl border border-lavender-mist bg-eclipse-black text-ink-black">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-semibold tracking-[-0.03em] text-ink-black">Password</CardTitle>
        <CardDescription className="text-silver-smoke">Change your account password.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6 pt-0">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="current-password" className="text-silver-smoke">
            Current password
          </Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border-lavender-mist bg-cream-canvas text-ink-black"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password" className="text-silver-smoke">
            New password
          </Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border-lavender-mist bg-cream-canvas text-ink-black"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-password" className="text-silver-smoke">
            Confirm new password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-lavender-mist bg-cream-canvas text-ink-black"
          />
        </div>
        <Button
          onClick={savePassword}
          disabled={saving || !currentPassword || !newPassword}
          className="w-fit"
        >
          {saving ? "Updating…" : "Update password"}
        </Button>
      </CardContent>
    </Card>
  )
}

function DangerZoneCard() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    setDeleting(true)
    const { error } = await authClient.deleteUser({ password })
    setDeleting(false)
    if (error) {
      toast.error(error.message ?? "Could not delete account")
      return
    }
    clearFileCache()
    router.push("/login")
    router.refresh()
  }

  return (
    <Card className="max-w-2xl border border-destructive/30 bg-eclipse-black text-ink-black">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-semibold tracking-[-0.03em] text-destructive">Danger zone</CardTitle>
        <CardDescription className="text-silver-smoke">
          Permanently delete your account and every file you own. This can&rsquo;t be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <AlertDialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setPassword("")
          }}
        >
          <AlertDialogTrigger render={<Button variant="destructive"><Trash2Icon data-icon="inline-start" />Delete account</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes your account and every file you own. Enter your password to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={confirmDelete}
                disabled={!password || deleting}
              >
                {deleting ? "Deleting…" : "Delete account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

function AccountTab() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <ProfileCard />
      <PasswordCard />
      <DangerZoneCard />
    </div>
  )
}

function NotificationPreferencesCard() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null)

  useEffect(() => {
    let ignore = false
    getNotificationPreferences()
      .then((res) => {
        if (!ignore) setPrefs(res)
      })
      .catch(() => {
        if (!ignore) setPrefs({ userId: "", notifyOnFileShared: true })
      })
    return () => {
      ignore = true
    }
  }, [])

  async function toggle(checked: boolean) {
    setPrefs((prev) => (prev ? { ...prev, notifyOnFileShared: checked } : prev))
    try {
      await updateNotificationPreferences({ notifyOnFileShared: checked })
    } catch {
      toast.error("Could not update notification preference")
      setPrefs((prev) => (prev ? { ...prev, notifyOnFileShared: !checked } : prev))
    }
  }

  return (
    <Card className="max-w-2xl border border-lavender-mist bg-eclipse-black text-ink-black">
      <CardHeader className="p-6">
        <CardTitle className="text-xl font-semibold tracking-[-0.03em] text-ink-black">Preferences</CardTitle>
        <CardDescription className="text-silver-smoke">Choose what notifies you.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-lavender-mist/60 bg-cream-canvas p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-black">File shares</p>
            <p className="text-xs text-ash-wisp">Notify me when someone shares a file with me.</p>
          </div>
          <Switch
            checked={prefs?.notifyOnFileShared ?? true}
            onCheckedChange={toggle}
            disabled={prefs === null}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationsTab() {
  return <NotificationPreferencesCard />
}

function HelpTab() {
  return (
    <Empty className="max-w-2xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HelpCircleIcon />
        </EmptyMedia>
        <EmptyTitle>Help & Support</EmptyTitle>
        <EmptyDescription>Support isn&rsquo;t set up yet — check back soon.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>("account")

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <MobileSettings />
      <div className="hidden md:block shrink-0 sticky top-0 z-10 bg-card">
        <DashboardTopbar title="Settings" />
      </div>
      <div className="mx-auto hidden w-full max-w-[1440px] flex-col gap-6 p-4 md:flex md:p-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "account" && <AccountTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "storage" && (
          <div className="max-w-md">
            <StorageBreakdown />
          </div>
        )}
        {tab === "help" && <HelpTab />}
      </div>
    </div>
  )
}
