import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth.js";
import { files } from "./files.js";

export const fileShares = pgTable(
  "file_shares",
  {
    id: text("id").primaryKey(),
    fileId: text("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    sharedWithUserId: text("shared_with_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    sharedByUserId: text("shared_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("file_shares_file_user_idx").on(table.fileId, table.sharedWithUserId),
    index("file_shares_shared_with_idx").on(table.sharedWithUserId),
  ],
);
