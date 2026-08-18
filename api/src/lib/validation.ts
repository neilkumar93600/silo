import { z } from "zod";
import { env } from "../env.js";

// Extensions that are never safe to let someone else's browser execute.
// This is defense-in-depth only — the real mitigation against stored
// content (e.g. an uploaded .html/.svg with a script payload) is that
// downloads are always served with `Content-Disposition: attachment`
// (see lib/s3.ts presignDownload), so browsers never render file
// content inline regardless of what was uploaded.
const DANGEROUS_EXTENSIONS = new Set([
  "exe", "dll", "so", "msi", "bat", "cmd", "com", "scr", "ps1", "vbs",
  "vbe", "wsf", "wsh", "jar", "sh", "bash", "app", "apk", "deb", "rpm",
  "jse", "cpl", "reg", "gadget", "hta",
]);

export function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1 || dot === filename.length - 1) return "";
  return filename.slice(dot + 1).toLowerCase();
}

export function isDangerousUpload(filename: string): boolean {
  return DANGEROUS_EXTENSIONS.has(extensionOf(filename));
}

export const createUploadSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  contentType: z.string().trim().min(1).max(255),
  sizeBytes: z
    .number()
    .int()
    .positive()
    .max(env.MAX_UPLOAD_BYTES, `File exceeds the ${env.MAX_UPLOAD_BYTES} byte limit`),
  folderId: z.string().trim().min(1).optional(),
});

export const patchFileSchema = z.object({
  visibility: z.enum(["private", "public"]).optional(),
  originalName: z.string().trim().min(1).max(255).optional(),
  folderId: z.string().trim().min(1).nullable().optional(),
  starred: z.boolean().optional(),
});

// folderId omitted -> all files regardless of folder (Recent). "root" -> top
// level only. Any other string -> files inside that folder.
export const listFilesQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  folderId: z.string().trim().min(1).optional(),
});

export const createFolderSchema = z.object({
  name: z.string().trim().min(1).max(255),
  parentId: z.string().trim().min(1).nullable().default(null),
});

export const patchFolderSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  parentId: z.string().trim().min(1).nullable().optional(),
  starred: z.boolean().optional(),
});

export const shareFileSchema = z.object({
  email: z.string().trim().email(),
});

export const listFoldersQuerySchema = z.object({
  parentId: z.string().trim().min(1).default("root"),
});
