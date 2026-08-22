import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { folders } from "../db/schema/folders.js";
import { files } from "../db/schema/files.js";
import { deleteObject } from "../lib/s3.js";
import { Errors } from "../lib/errors.js";

type Folder = typeof folders.$inferSelect;

export async function getOwnedFolderOrThrow(folderId: string, ownerId: string): Promise<Folder> {
  const [folder] = await db.select().from(folders).where(eq(folders.id, folderId)).limit(1);

  if (!folder) throw Errors.notFound("Folder");
  if (folder.ownerId !== ownerId) throw Errors.forbidden();

  return folder;
}

async function getAncestors(folder: Folder, ownerId: string): Promise<Folder[]> {
  const parents: Folder[] = [];
  let current = folder;

  while (current.parentId) {
    const parent = await getOwnedFolderOrThrow(current.parentId, ownerId);
    parents.unshift(parent);
    current = parent;
  }

  return parents;
}

// Pure BFS over a "fetch the next level" function — kept separate from the
// Drizzle query below so the traversal itself is unit-testable without a
// database.
export async function walkDescendants(
  rootIds: string[],
  fetchChildren: (parentIds: string[]) => Promise<string[]>,
): Promise<string[]> {
  const result: string[] = [];
  let frontier = rootIds;

  while (frontier.length > 0) {
    frontier = await fetchChildren(frontier);
    result.push(...frontier);
  }

  return result;
}

// Walks parentId -> children level by level. Fine at the scale a personal
// file manager's folder trees reach; swap for a recursive CTE if that stops
// being true.
async function collectDescendantIds(ownerId: string, rootId: string): Promise<string[]> {
  return walkDescendants([rootId], async (parentIds) => {
    const children = await db
      .select({ id: folders.id })
      .from(folders)
      .where(and(eq(folders.ownerId, ownerId), inArray(folders.parentId, parentIds)));

    return children.map((c) => c.id);
  });
}

export async function createFolder(ownerId: string, name: string, parentId: string | null) {
  if (parentId) {
    await getOwnedFolderOrThrow(parentId, ownerId);
  }

  const id = randomUUID();
  const [folder] = await db.insert(folders).values({ id, ownerId, name, parentId }).returning();

  return folder;
}

// Attaches an `itemCount` (direct files + subfolders) to each folder, so the
// UI can tell an empty folder from one with contents without a fetch per card.
export async function attachItemCounts(targetFolders: Folder[], ownerId: string) {
  if (targetFolders.length === 0) return [];

  const ids = targetFolders.map((f) => f.id);

  const [nestedFiles, nestedFolders] = await Promise.all([
    db
      .select({ folderId: files.folderId })
      .from(files)
      .where(
        and(
          eq(files.ownerId, ownerId),
          inArray(files.folderId, ids),
          eq(files.status, "uploaded"),
          isNull(files.deletedAt),
        ),
      ),
    db
      .select({ parentId: folders.parentId })
      .from(folders)
      .where(and(eq(folders.ownerId, ownerId), inArray(folders.parentId, ids), isNull(folders.deletedAt))),
  ]);

  const counts = new Map<string, number>();
  for (const { folderId } of nestedFiles) {
    if (folderId) counts.set(folderId, (counts.get(folderId) ?? 0) + 1);
  }
  for (const { parentId } of nestedFolders) {
    if (parentId) counts.set(parentId, (counts.get(parentId) ?? 0) + 1);
  }

  return targetFolders.map((f) => ({ ...f, itemCount: counts.get(f.id) ?? 0 }));
}

export async function listFolderContents(ownerId: string, parentId: string) {
  const isRoot = parentId === "root";
  const folder = isRoot ? null : await getOwnedFolderOrThrow(parentId, ownerId);
  const parents = folder ? await getAncestors(folder, ownerId) : [];

  const folderParentCondition = isRoot ? isNull(folders.parentId) : eq(folders.parentId, parentId);
  const childFolders = await db
    .select()
    .from(folders)
    .where(and(eq(folders.ownerId, ownerId), folderParentCondition, isNull(folders.deletedAt)))
    .orderBy(folders.name);

  // Home ("root") surfaces every file the user owns, not just root-level
  // ones - folders are still root-scoped above so browsing behaves normally,
  // but the file list underneath is meant to be a global "everything you've
  // uploaded" view (minus trash).
  const childFiles = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.ownerId, ownerId),
        ...(isRoot ? [] : [eq(files.folderId, parentId)]),
        eq(files.status, "uploaded"),
        isNull(files.deletedAt),
      ),
    )
    .orderBy(desc(files.createdAt));

  const foldersWithCounts = await attachItemCounts(childFolders, ownerId);

  return { folder, parents, folders: foldersWithCounts, files: childFiles };
}

export async function updateFolder(
  folderId: string,
  ownerId: string,
  updates: { name?: string; parentId?: string | null; starred?: boolean },
) {
  await getOwnedFolderOrThrow(folderId, ownerId);

  if (updates.parentId) {
    if (updates.parentId === folderId) throw Errors.badRequest("A folder cannot be its own parent");
    await getOwnedFolderOrThrow(updates.parentId, ownerId);

    const descendantIds = await collectDescendantIds(ownerId, folderId);
    if (descendantIds.includes(updates.parentId)) {
      throw Errors.badRequest("Cannot move a folder into its own descendant");
    }
  }

  const [updated] = await db
    .update(folders)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(folders.id, folderId))
    .returning();

  return updated;
}

export async function trashFolder(folderId: string, ownerId: string) {
  await getOwnedFolderOrThrow(folderId, ownerId);

  const folderIds = [folderId, ...(await collectDescendantIds(ownerId, folderId))];
  const now = new Date();

  await db.update(folders).set({ deletedAt: now, updatedAt: now }).where(inArray(folders.id, folderIds));
  await db.update(files).set({ deletedAt: now, updatedAt: now }).where(inArray(files.folderId, folderIds));
}

export async function restoreFolder(folderId: string, ownerId: string) {
  const folder = await getOwnedFolderOrThrow(folderId, ownerId);
  if (!folder.deletedAt) throw Errors.badRequest("Folder is not in trash");

  // Cascades to every currently-trashed descendant, even one trashed
  // independently before this folder was. Acceptable for v1.
  const folderIds = [folderId, ...(await collectDescendantIds(ownerId, folderId))];
  const now = new Date();

  await db.update(folders).set({ deletedAt: null, updatedAt: now }).where(inArray(folders.id, folderIds));
  await db.update(files).set({ deletedAt: null, updatedAt: now }).where(inArray(files.folderId, folderIds));
}

export async function permanentDeleteFolder(folderId: string, ownerId: string) {
  const folder = await getOwnedFolderOrThrow(folderId, ownerId);
  if (!folder.deletedAt) throw Errors.badRequest("Folder is not in trash");

  const folderIds = [folderId, ...(await collectDescendantIds(ownerId, folderId))];

  const filesToDelete = await db.select().from(files).where(inArray(files.folderId, folderIds));
  for (const file of filesToDelete) {
    await deleteObject(file.s3Key);
  }

  // Explicit file cleanup above (S3 objects) then rows; folder rows cascade
  // via the FK as a safety net, not the primary mechanism.
  await db.delete(files).where(inArray(files.folderId, folderIds));
  await db.delete(folders).where(inArray(folders.id, folderIds));
}

export async function listAllFolders(ownerId: string) {
  return db
    .select()
    .from(folders)
    .where(and(eq(folders.ownerId, ownerId), isNull(folders.deletedAt)))
    .orderBy(folders.name);
}

