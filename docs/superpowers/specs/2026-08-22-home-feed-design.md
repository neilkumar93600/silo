# Home feed: merged files, view tracking, mobile grid

## Problem

Three related issues with the dashboard Home page (`web/app/(dashboard)/dashboard/page.tsx`):

1. **Bug**: Home renders `<FileManager mode={{ type: "folder", folderId: "root" }} />`, which calls `listFolder("root")` and only returns top-level files. Files uploaded into any subfolder never appear on Home, even though the app already has an "all files, any folder" query (`listFiles()` with no `folderId`, used by `/dashboard/recent`).
2. **Missing feature**: there is no concept of "recently viewed" anywhere in the schema, API, or UI. Files shared with the user (`/dashboard/shared`) are also never surfaced on Home.
3. **Mobile grid**: `FileGrid` and `FolderGrid` lay out with `grid-template-columns: repeat(auto-fill, minmax(180px/150px, 1fr))`. On narrow phones (~360-390px viewport, minus padding) this sometimes collapses to a single column.

## Goals

- Home's Files section shows every file the user owns, in any folder (fixes #1).
- Home's Files section also includes files shared with the user, and reflects recency of viewing — not just upload time — for both owned and shared files (#2).
- Folder shortcuts (root subfolders) stay visible on Home, unchanged from today.
- File/folder grids guarantee 2 columns on mobile widths.

## Non-goals

- Full pagination / infinite scroll on Home. The app has no "load more" UI anywhere today (Recent page already caps at 50 with no pagination control) — Home follows the same existing pattern, capped at 50 merged items.
- View tracking for anonymous public share-link (`/s/[slug]`) visits. Only counts for authenticated views of files the viewer owns or has been shared.
- Changing sharing permissions/roles (still binary: owner has full control, everyone else read-only).

## Design

### 1. Data model

New table `file_views` (`api/src/db/schema/file-views.ts`):

```
id           text primary key
userId       text  -> user.id, cascade delete
fileId       text  -> files.id, cascade delete
viewedAt     timestamp, not null, default now()

unique index (userId, fileId)
index on userId
```

One row per (user, file) — upserted on every view, not an append-only log. Only the latest `viewedAt` is ever read.

### 2. Recording a view

Hook into `filesService.getDownloadUrl(fileId, userId, inline)` (`api/src/services/files.service.ts:230`) — the single chokepoint already used by both the file preview dialog (fetches inline + attachment URLs) and real downloads, for files the user owns *or* has been shared (`getAccessibleFileOrThrow` already authorizes both). After authorization succeeds, upsert `file_views` (`onConflictDoUpdate` set `viewedAt = now()`).

No frontend instrumentation needed — every existing preview/download call path already routes through this function.

`getPublicDownloadUrl` (unauthenticated share-slug access) is untouched — no `userId` available, and public link opens should not count as the owner "viewing" their own file via someone else's click.

### 3. Home feed query

New `getHomeFeed(userId, limit = 50)` in `files.service.ts` (or a new `home.service.ts`):

1. Fetch the user's own files, any folder, capped at `limit`, newest first — same conditions as the existing `listFiles` (folderId omitted).
2. Fetch files shared with the user — reuse `sharesService.listSharedWithMe(userId)` (already attaches `sharedBy: { name, email }`).
3. Fetch this user's `file_views` rows for the union of file ids from (1) and (2); build a `Map<fileId, viewedAt>`.
4. For each file, compute `lastActivityAt = max(baseTimestamp, viewedAt ?? -Infinity)`, where `baseTimestamp` is `createdAt` for owned files and `sharedAt` (`fileShares.createdAt`) for shared files.
5. Merge, sort by `lastActivityAt` desc, slice to `limit`. If a file id somehow appears in both sets (edge case: a user shares a file with their own email), keep the owned copy.

App-level merge (fetch-then-sort-in-JS), not a single SQL UNION — simpler to read and correct at this app's scale (personal drive, not multi-tenant analytics).

New route: `GET /api/home` → `{ files: FileRecord[] }`, registered in `app.ts` alongside the other resource routers (`/api/shared-with-me`, `/api/starred`, etc.).

### 4. Frontend wiring

- `web/lib/api.ts`: add `listHomeFeed()` → `GET /api/home`.
- `FileManager` (`web/components/dashboard/file-manager.tsx`): add mode `{ type: "home" }`.
  - `refresh()`: new branch — `Promise.all([listFolder("root"), listHomeFeed()])`, set `folders` from the folder result (keeps the shortcuts row) and `files` from the home feed.
  - `showFolders` must be true for home mode too (currently `showFolders = isFolderMode`).
  - `isRootHero` (empty-state welcome screen) extends to home mode the same way it applies to folder-root today.
  - **`currentFolderId` must resolve to `"root"` for home mode, not `null`.** `useFolderSync(currentFolderId, refresh)` feeds `DriveContext.activeFolderId`, and `dashboard-sidebar.tsx:84` hides the New/Upload button entirely when `activeFolderId` is null. Every other non-folder mode (`recent`, `shared`, `starred`) already accepts this trade-off (no upload button on those pages) — Home cannot, since it's the primary landing page and must keep "upload here" working exactly as it does today. Fix: `currentFolderId = isFolderMode ? mode.folderId : mode.type === "home" ? "root" : null`.
- `web/app/(dashboard)/dashboard/page.tsx`: `mode={{ type: "folder", folderId: "root" }}` → `mode={{ type: "home" }}`.

### 5. Permissions on the merged list

Home's Files section mixes owned and shared items in one grid — unlike today's `/dashboard/shared` page, which is 100% shared and sets a single page-level `readOnly`. Reuse the existing per-file `sharedBy` signal instead of adding new props:

- `FileGrid` / `FileTable`: per-row `readOnly = pageReadOnly || Boolean(file.sharedBy)`, passed to `RowActions` (already hides rename/share/move/star/delete when `readOnly`).
- Multi-select checkbox only renders when the file is not shared (`onToggleSelect` passed as `undefined` for shared rows) — this is what actually blocks bulk trash/star/move, since `FileManager`'s bulk handlers only ever act on `selectedIds`, which can never contain a shared file's id.
- "Select all" (`handleToggleSelectAll`) selects only non-shared visible files.

Preview and download remain available for shared files, same as `/dashboard/shared` today.

### 6. Mobile grid

`FileGrid` (`file-grid.tsx:142`) and `FolderGrid` (`folder-grid.tsx:63`) currently use an inline `style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px/150px, 1fr))" }}`, which can drop to 1 column under ~380px viewport width. Replace with Tailwind classes that guarantee 2 columns at the base (mobile) breakpoint and keep the auto-fill behavior at `sm:` and up:

```
className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
```

(150px for FolderGrid.)

## Testing

- `file-views` upsert: a small vitest unit test on the service function (insert then re-insert same user/file, assert one row with updated `viewedAt`).
- `getHomeFeed`: unit test with fixtures covering — owned file never viewed, owned file viewed, shared file never viewed, shared file viewed, ordering by `lastActivityAt`.
- Manual/UI check: upload into a subfolder → confirm it appears on Home; open a shared file → confirm it moves up in Home's ordering; confirm New/Upload button still visible on Home; confirm 2-column grid at a 375px viewport.
