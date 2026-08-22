import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { files } from "../db/schema/files.js";
import { fileViews } from "../db/schema/file-views.js";
import { listSharedWithMe } from "./shares.service.js";

// Matches the app's existing no-pagination pattern — /dashboard/recent
// already caps at 50 with no "load more" UI anywhere.
const HOME_FEED_LIMIT = 50;

export async function getHomeFeed(userId: string) {
  const [ownedFiles, shared] = await Promise.all([
    db
      .select()
      .from(files)
      .where(and(eq(files.ownerId, userId), eq(files.status, "uploaded"), isNull(files.deletedAt)))
      .orderBy(desc(files.createdAt))
      .limit(HOME_FEED_LIMIT),
    listSharedWithMe(userId),
  ]);

  // A file shared with your own email (edge case) shows up in both sets —
  // keep the owned copy only.
  const sharedFiles = shared.files.filter((f) => f.ownerId !== userId);

  const allIds = [...ownedFiles.map((f) => f.id), ...sharedFiles.map((f) => f.id)];
  const viewRows = allIds.length
    ? await db
        .select()
        .from(fileViews)
        .where(and(eq(fileViews.userId, userId), inArray(fileViews.fileId, allIds)))
    : [];
  const viewedAt = new Map(viewRows.map((v) => [v.fileId, v.viewedAt.getTime()]));

  const withActivity = [
    ...ownedFiles.map((f) => ({
      file: f,
      lastActivityAt: Math.max(f.createdAt.getTime(), viewedAt.get(f.id) ?? 0),
    })),
    ...sharedFiles.map((f) => ({
      file: f,
      lastActivityAt: Math.max(new Date(f.sharedAt).getTime(), viewedAt.get(f.id) ?? 0),
    })),
  ];

  withActivity.sort((a, b) => b.lastActivityAt - a.lastActivityAt);

  return { files: withActivity.slice(0, HOME_FEED_LIMIT).map((entry) => entry.file) };
}
