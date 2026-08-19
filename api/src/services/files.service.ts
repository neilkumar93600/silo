import { randomUUID, randomBytes } from "node:crypto";
import { and, desc, eq, isNull, lt } from "drizzle-orm";
import { db } from "../db/index.js";
import { files } from "../db/schema/files.js";
import { fileShares } from "../db/schema/file-shares.js";
import { presignUpload, presignDownload, headObject, deleteObject } from "../lib/s3.js";
import { isDangerousUpload } from "../lib/validation.js";
import { Errors } from "../lib/errors.js";
import { getOwnedFolderOrThrow } from "./folders.service.js";

// Size we tolerate between what the client declared and what actually
// landed in S3 before we treat it as a mismatch. Multipart/chunked
// encoding on the client side can shift the reported byte count slightly;
// this is not a security boundary (visibility/ownership checks are), just
// a sanity check that something was actually uploaded.
const SIZE_MISMATCH_TOLERANCE_BYTES = 0;

function s3KeyFor(ownerId: string, fileId: string) {
  return `uploads/${ownerId}/${fileId}`;
}

export async function createPendingUpload(params: {
  ownerId: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  folderId?: string;
}) {
  if (isDangerousUpload(params.filename)) {
    throw Errors.badRequest("This file type is not allowed");
  }

  if (params.folderId) {
    await getOwnedFolderOrThrow(params.folderId, params.ownerId);
  }

  const id = randomUUID();
  const shareSlug = randomBytes(9).toString("base64url");
  const s3Key = s3KeyFor(params.ownerId, id);

  await db.insert(files).values({
    id,
    ownerId: params.ownerId,
    folderId: params.folderId ?? null,
    originalName: params.filename,
    mimeType: params.contentType,
    sizeBytes: params.sizeBytes,
    s3Key,
    shareSlug,
    visibility: "private",
    status: "pending",
  });

  const uploadUrl = await presignUpload(s3Key, params.contentType);

  return { fileId: id, uploadUrl };
}

export async function completeUpload(fileId: string, ownerId: string) {
  const file = await getOwnedFileOrThrow(fileId, ownerId);

  if (file.status === "uploaded") {
    return file;
  }

  const head = await headObject(file.s3Key);

  if (!head.exists || Math.abs(head.size - file.sizeBytes) > SIZE_MISMATCH_TOLERANCE_BYTES) {
    await db.delete(files).where(eq(files.id, fileId));
    throw Errors.badRequest("Upload could not be verified. Please try again.");
  }

  const [updated] = await db
    .update(files)
    .set({ status: "uploaded", updatedAt: new Date() })
    .where(eq(files.id, fileId))
    .returning();

  return updated;
}

export async function listFiles(ownerId: string, opts: { cursor?: string; limit: number; folderId?: string }) {
  const conditions = [eq(files.ownerId, ownerId), eq(files.status, "uploaded"), isNull(files.deletedAt)];
  if (opts.cursor) {
    conditions.push(lt(files.createdAt, new Date(opts.cursor)));
  }
  // folderId omitted -> every file regardless of folder (Recent). "root" ->
  // top-level only. Any other value -> files inside that folder.
  if (opts.folderId === "root") {
    conditions.push(isNull(files.folderId));
  } else if (opts.folderId) {
    conditions.push(eq(files.folderId, opts.folderId));
  }

  const rows = await db
    .select()
    .from(files)
    .where(and(...conditions))
    .orderBy(desc(files.createdAt))
    .limit(opts.limit);

  const nextCursor = rows.length === opts.limit ? rows[rows.length - 1]!.createdAt.toISOString() : null;

  return { items: rows, nextCursor };
}

export async function getOwnedFileOrThrow(fileId: string, ownerId: string) {
  const [file] = await db.select().from(files).where(eq(files.id, fileId)).limit(1);

  if (!file) throw Errors.notFound("File");
  if (file.ownerId !== ownerId) throw Errors.forbidden();

  return file;
}

export async function getAccessibleFileOrThrow(fileId: string, userId: string) {
  const [file] = await db.select().from(files).where(eq(files.id, fileId)).limit(1);
  if (!file) throw Errors.notFound("File");
  if (file.ownerId === userId) return file;

  const [share] = await db
    .select()
    .from(fileShares)
    .where(and(eq(fileShares.fileId, fileId), eq(fileShares.sharedWithUserId, userId)))
    .limit(1);
  if (!share || file.deletedAt) throw Errors.forbidden();

  return file;
}

export async function updateFile(
  fileId: string,
  ownerId: string,
  patch: { visibility?: "private" | "public"; originalName?: string; folderId?: string | null },
) {
  await getOwnedFileOrThrow(fileId, ownerId);

  if (patch.folderId) {
    await getOwnedFolderOrThrow(patch.folderId, ownerId);
  }

  const [updated] = await db
    .update(files)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(files.id, fileId))
    .returning();

  return updated;
}

export async function trashFile(fileId: string, ownerId: string) {
  await getOwnedFileOrThrow(fileId, ownerId);

  const [updated] = await db
    .update(files)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(files.id, fileId))
    .returning();

  return updated;
}

export async function restoreFile(fileId: string, ownerId: string) {
  const file = await getOwnedFileOrThrow(fileId, ownerId);
  if (!file.deletedAt) throw Errors.badRequest("File is not in trash");

  const [updated] = await db
    .update(files)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(eq(files.id, fileId))
    .returning();

  return updated;
}

export async function permanentDeleteFile(fileId: string, ownerId: string) {
  const file = await getOwnedFileOrThrow(fileId, ownerId);
  if (!file.deletedAt) throw Errors.badRequest("File is not in trash");

  await deleteObject(file.s3Key);
  await db.delete(files).where(eq(files.id, fileId));
}

export async function getDownloadUrl(fileId: string, userId: string) {
  const file = await getAccessibleFileOrThrow(fileId, userId);
  if (file.status !== "uploaded") throw Errors.notFound("File");
  return presignDownload(file.s3Key, file.originalName);
}

export async function getPublicDownloadUrl(shareSlug: string) {
  const [file] = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.shareSlug, shareSlug),
        eq(files.visibility, "public"),
        eq(files.status, "uploaded"),
        isNull(files.deletedAt),
      ),
    )
    .limit(1);

  // Same 404 whether the slug doesn't exist, belongs to a private file, or
  // was never fully uploaded — don't let the response shape leak which.
  if (!file) throw Errors.notFound("File");

  const url = await presignDownload(file.s3Key, file.originalName);
  return { url, file };
}
