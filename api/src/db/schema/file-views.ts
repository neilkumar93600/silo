import { pgTable, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { user } from "./auth.js";
import { files } from "./files.js";

// One row per (user, file) — upserted on every view, not an append-only
// log. Only the latest viewedAt is ever read.
export const fileViews = pgTable(
  "file_views",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fileId: text("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("file_views_user_file_idx").on(table.userId, table.fileId),
    index("file_views_user_id_idx").on(table.userId),
  ],
);
