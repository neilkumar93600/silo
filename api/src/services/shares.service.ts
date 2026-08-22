import { randomUUID } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { fileShares } from "../db/schema/file-shares.js";
import { files } from "../db/schema/files.js";
import { user } from "../db/schema/auth.js";
import { Errors } from "../lib/errors.js";
import { getOwnedFileOrThrow } from "./files.service.js";
import { createNotification } from "./notifications.service.js";
import { getPreferences } from "./notification-preferences.service.js";

export async function listShares(fileId: string, ownerId: string) {
  await getOwnedFileOrThrow(fileId, ownerId);

  return db
    .select({ userId: user.id, name: user.name, email: user.email, sharedAt: fileShares.createdAt })
    .from(fileShares)
    .innerJoin(user, eq(fileShares.sharedWithUserId, user.id))
    .where(eq(fileShares.fileId, fileId));
}

export async function addShare(fileId: string, ownerId: string, email: string) {
  const file = await getOwnedFileOrThrow(fileId, ownerId);

  const [recipient] = await db.select().from(user).where(eq(user.email, email)).limit(1);
  if (!recipient) throw Errors.badRequest("No Silo user with that email");

  const [inserted] = await db
    .insert(fileShares)
    .values({ id: randomUUID(), fileId, sharedWithUserId: recipient.id, sharedByUserId: ownerId })
    .onConflictDoNothing()
    .returning({ id: fileShares.id });

  // Only notify on a genuinely new share — re-sharing with someone who
  // already has access is a silent no-op (onConflictDoNothing), so don't
  // spam a duplicate notification for it.
  if (inserted) {
    const preferences = await getPreferences(recipient.id);
    if (preferences.notifyOnFileShared) {
      const [owner] = await db.select({ name: user.name }).from(user).where(eq(user.id, ownerId)).limit(1);
      await createNotification({
        userId: recipient.id,
        actorId: ownerId,
        type: "file_shared",
        title: `${owner?.name ?? "Someone"} shared a file with you`,
        body: file.originalName,
        fileId,
      });
    }
  }

  return listShares(fileId, ownerId);
}

export async function removeShare(fileId: string, ownerId: string, targetUserId: string) {
  await getOwnedFileOrThrow(fileId, ownerId);

  await db.delete(fileShares).where(and(eq(fileShares.fileId, fileId), eq(fileShares.sharedWithUserId, targetUserId)));

  return listShares(fileId, ownerId);
}

export async function listSharedWithMe(userId: string) {
  const rows = await db
    .select({ file: files, sharedByName: user.name, sharedByEmail: user.email, sharedAt: fileShares.createdAt })
    .from(fileShares)
    .innerJoin(files, eq(fileShares.fileId, files.id))
    .innerJoin(user, eq(fileShares.sharedByUserId, user.id))
    .where(
      and(
        eq(fileShares.sharedWithUserId, userId),
        eq(files.status, "uploaded"),
        isNull(files.deletedAt),
      ),
    );

  return {
    files: rows.map((row) => ({
      ...row.file,
      sharedBy: { name: row.sharedByName, email: row.sharedByEmail },
      sharedAt: row.sharedAt,
    })),
  };
}
