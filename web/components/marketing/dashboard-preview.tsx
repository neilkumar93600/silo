const rows = [
  { name: "brand-guidelines.pdf", size: "4.2 MB", visibility: "Private", ext: "PDF" },
  { name: "product-launch.mp4", size: "812 MB", visibility: "Private", ext: "MP4" },
  { name: "team-offsite.zip", size: "156 MB", visibility: "Public", ext: "ZIP" },
]

export function DashboardPreview() {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-lavender-mist bg-eclipse-black text-left shadow-[0_0_60px_rgba(185,151,255,0.15)]">
      {/* Top window bar */}
      <div className="flex items-center justify-between border-b border-lavender-mist bg-void-plum/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-laser-violet/80" />
          <span className="size-2.5 rounded-full bg-laser-violet/80" />
          <span className="size-2.5 rounded-full bg-laser-violet/80" />
          <span className="ml-2 font-mono text-[11px] tracking-[0.05em] text-silver-smoke">
            /workspace/silo-vault
          </span>
        </div>
        <div className="rounded-full bg-carbon-ink border border-lavender-mist px-2.5 py-0.5 font-mono text-[10px] tracking-[0.05em] text-silver-smoke">
          1200 × 448 px
        </div>
      </div>

      {/* Internal showcase view */}
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-medium text-paper-white">All Files</span>
            <span className="rounded-full bg-carbon-ink px-2 py-0.5 font-mono text-[10px] text-ash-wisp border border-lavender-mist">
              3 items
            </span>
          </div>
          <div className="rounded-md border border-lavender-mist bg-void-plum px-3 py-1 text-[12px] text-silver-smoke">
            Filter: All
          </div>
        </div>

        <div className="flex flex-col divide-y divide-lavender-mist/40 rounded-lg border border-lavender-mist/60 bg-void-plum/80">
          {rows.map((row) => (
            <div key={row.name} className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-lavender-mist/20">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex size-7 items-center justify-center rounded bg-carbon-ink text-[10px] font-mono font-bold text-laser-violet border border-lavender-mist">
                  {row.ext}
                </span>
                <span className="truncate text-[14px] font-medium text-paper-white">{row.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="font-mono text-[12px] text-silver-smoke">{row.size}</span>
                <span
                  className={
                    row.visibility === "Public"
                      ? "rounded-full bg-laser-violet/20 border border-laser-violet/40 px-2.5 py-0.5 text-[11px] font-medium text-laser-violet"
                      : "rounded-full bg-carbon-ink border border-lavender-mist px-2.5 py-0.5 text-[11px] text-silver-smoke"
                  }
                >
                  {row.visibility}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

