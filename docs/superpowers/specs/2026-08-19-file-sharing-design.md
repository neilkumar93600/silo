# File sharing ("Shared with me") — design

## Scope

Files only (not folders). View/download only for recipients — no rename,
move, delete, star, or re-share. Share target is an existing Silo user
looked up by email (`user.email` is unique); no invite-if-not-found flow,
no notifications. Sharing is independent of `visibility` — a private file
can carry explicit share grants; a public file's link-based access is
unaffected by who it's explicitly shared with.

## Data model

New table `file_shares` (api/src/db/schema/file-shares.ts):

```ts
export const fileShares = pgTable(
  "file_shares",
  {
    id: text("id").primaryKey(),
    fileId: text("file_id").notNull().references(() => files.id, { onDelete: "cascade" }),
    sharedWithUserId: text("shared_with_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    sharedByUserId: text("shared_by_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("file_shares_file_user_idx").on(table.fileId, table.sharedWithUserId),
    index("file_shares_shared_with_idx").on(table.sharedWithUserId),
  ],
);
```

Migration via `npm run db:generate` + `npm run db:migrate`, same as the
`starred` column addition earlier this session.

## Access control

`files.service.ts` gets a new `getAccessibleFileOrThrow(fileId, userId)`:
owner OR a matching `file_shares` row, else 403/404 (same not-found-vs-
forbidden shape as `getOwnedFileOrThrow`). Used **only** by:

- `GET /api/files/:id/download` (existing route, swap the ownership check)
- Preview (same download endpoint, no separate route)

Every mutating path — `updateFile` (rename/move/starred/visibility),
`trashFile` — keeps `getOwnedFileOrThrow` unchanged. A recipient has no
write access, full stop.

`listFiles`/`listFolder` are unaffected — a shared-with-me file does not
appear in the owner's folder listing to anyone but the owner; it only
surfaces via the new shared-with-me listing below.

## New endpoints

New `api/src/services/shares.service.ts` holds all the logic below;
`fileShareService.listShares/addShare/removeShare` for the owner-side
per-file operations, `listSharedWithMe` for the recipient-side listing.

**Owner-side, mounted on the existing `filesRouter`** (file-scoped, so it
belongs next to the other `/api/files/:id/*` routes, same as `/download`
and `/complete`):

- `GET /api/files/:id/shares` — owner-only (`getOwnedFileOrThrow`). Lists
  current recipients: `{ userId, name, email, sharedAt }[]`.
- `POST /api/files/:id/shares` body `{ email }` — owner-only. Looks up
  `user` by email; 404 `"No Silo user with that email"` if none. Inserts
  the share row (no-op if it already exists — unique index absorbs it).
  Returns the updated recipient list.
- `DELETE /api/files/:id/shares/:userId` — owner-only. Removes the row.

**Recipient-side, new top-level route** (mirrors `/api/trash`,
`/api/starred` — its own router in `api/src/routes/shared.ts`, mounted at
`/api/shared-with-me` in `app.ts`):

- `GET /api/shared-with-me` — any authenticated user. Joins `file_shares`
  (`sharedWithUserId = req.userId`) → `files` → owner's `user` row for
  display name. Shape: `{ files: (FileRecord & { sharedBy: { name, email } })[] }`.

## Frontend

**`lib/api.ts`**: `FileRecord` gains nothing (share state isn't a file
column). New: `listFileShares(fileId)`, `addFileShare(fileId, email)`,
`removeFileShare(fileId, userId)`, `listSharedWithMe()`.

**`ShareDialog`**: add a "Share with a person" email input (submit on
Enter, inline error if the lookup 404s) + a list of current recipients
(avatar-initials + name/email + × to remove). Sits alongside the existing
public-link toggle — same dialog, two independent sections.

**`FileManager`**: 5th `Mode` variant `{ type: "shared" }`. Reuses
`fetchModeContents` (add a branch calling `listSharedWithMe`). New
`readOnly` derived flag (`mode.type === "shared"`) threaded into
`FileTable`/`FileGrid`/`RowActions`: when true, hide Rename/Share/Move to
folder/Star/Move to trash — leave only Download (and Preview, which isn't
a menu item). `FileGrid`'s footer row ("You uploaded · HH:MM") swaps to
"Shared by {name} · HH:MM" for this mode, using the joined `sharedBy`
field.

**Sidebar**: "Shared with me" nav item (between "My Drive" and "Recent"),
new `app/(dashboard)/dashboard/shared/page.tsx` mirroring `starred/page.tsx`.

## Explicitly out of scope (per answered questions)

- Folder sharing (cascading access) — files only for v1.
- Invite-by-email for non-users — share target must already have a Silo
  account.
- Email/in-app notification on share — recipient discovers it by opening
  "Shared with me".
- Per-recipient star/organize state — `starred` stays a single owner-side
  column, not per-viewer.
