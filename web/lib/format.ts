export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, exponent)
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
}

const RELATIVE_UNITS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "year", ms: 31536000000 },
  { unit: "month", ms: 2592000000 },
  { unit: "week", ms: 604800000 },
  { unit: "day", ms: 86400000 },
  { unit: "hour", ms: 3600000 },
  { unit: "minute", ms: 60000 },
]

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

export function formatRelativeTime(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now()
  const absMs = Math.abs(diffMs)
  if (absMs < 60000) return "Just now"
  for (const { unit, ms } of RELATIVE_UNITS) {
    if (absMs >= ms) return relativeFormatter.format(Math.round(diffMs / ms), unit)
  }
  return relativeFormatter.format(Math.round(diffMs / 60000), "minute")
}

export function initialsOf(name: string | undefined): string {
  if (!name) return "?"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}
