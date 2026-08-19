import { pgTable, text, timestamp, bigint, boolean, pgEnum, index, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth.js";
import { folders } from "./folders.js";

export const fileVisibility = pgEnum("file_visibility", ["private", "public"]);
export const fileStatus = pgEnum("file_status", ["pending", "uploaded"]);

export const files = pgTable(
  "files",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    folderId: text("folder_id").references(() => folders.id, { onDelete: "cascade" }),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    s3Key: text("s3_key").notNull(),
    visibility: fileVisibility("visibility").notNull().default("private"),
    status: fileStatus("status").notNull().default("pending"),
    shareSlug: text("share_slug").notNull(),
    starred: boolean("starred").notNull().default(false),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("files_owner_id_idx").on(table.ownerId),
    index("files_folder_id_idx").on(table.folderId),
    uniqueIndex("files_share_slug_idx").on(table.shareSlug),
  ],
);
