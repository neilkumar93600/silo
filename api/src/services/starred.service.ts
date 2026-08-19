import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { folders } from "../db/schema/folders.js";
import { files } from "../db/schema/files.js";
import { attachItemCounts } from "./folders.service.js";

export async function listStarred(ownerId: string) {
  const starredFolders = await db
    .select()
    .from(folders)
    .where(and(eq(folders.ownerId, ownerId), eq(folders.starred, true), isNull(folders.deletedAt)));

  const starredFiles = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.ownerId, ownerId),
        eq(files.starred, true),
        eq(files.status, "uploaded"),
        isNull(files.deletedAt),
      ),
    );

  const foldersWithCounts = await attachItemCounts(starredFolders, ownerId);

  return { folders: foldersWithCounts, files: starredFiles };
}
