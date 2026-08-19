import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { user } from "./auth.js";
import { files } from "./files.js";

export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }),
    // ponytail: plain text, not pgEnum — only one producer ("file_shared")
    // exists today; an enum would need a migration for every new type.
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    // set null, not cascade — title/body are already denormalized so the
    // notification is meant to survive the file being deleted; a cascade
    // here would silently erase the recipient's notification history.
    fileId: text("file_id").references(() => files.id, { onDelete: "set null" }),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_user_unread_idx").on(table.userId, table.read),
  ],
);
