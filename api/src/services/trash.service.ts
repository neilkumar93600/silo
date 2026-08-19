import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { folders } from "../db/schema/folders.js";
import { files } from "../db/schema/files.js";
import { deleteObject } from "../lib/s3.js";

// A trashed item is the root of its own deletion event — not just along for
// the ride via a parent folder's cascade — when it has no parent, or its
// parent isn't itself trashed.
export function isTrashRoot(parentId: string | null, trashedFolderIds: Set<string>): boolean {
  return !parentId || !trashedFolderIds.has(parentId);
}

export async function listTrash(ownerId: string) {
  const trashedFolders = await db
    .select()
    .from(folders)
    .where(and(eq(folders.ownerId, ownerId), isNotNull(folders.deletedAt)));
  const trashedFolderIds = new Set(trashedFolders.map((f) => f.id));

  const rootFolders = trashedFolders.filter((f) => isTrashRoot(f.parentId, trashedFolderIds));

  const trashedFiles = await db
    .select()
    .from(files)
    .where(and(eq(files.ownerId, ownerId), isNotNull(files.deletedAt)));
  const rootFiles = trashedFiles.filter((f) => isTrashRoot(f.folderId, trashedFolderIds));

  return { folders: rootFolders, files: rootFiles };
}

export async function emptyTrash(ownerId: string) {
  const trashedFiles = await db
    .select()
    .from(files)
    .where(and(eq(files.ownerId, ownerId), isNotNull(files.deletedAt)));

  for (const file of trashedFiles) {
    await deleteObject(file.s3Key);
  }

  await db.delete(files).where(and(eq(files.ownerId, ownerId), isNotNull(files.deletedAt)));
  await db.delete(folders).where(and(eq(folders.ownerId, ownerId), isNotNull(folders.deletedAt)));
}
