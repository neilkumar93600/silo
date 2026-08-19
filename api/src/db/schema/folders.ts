import { pgTable, text, timestamp, boolean, index, type AnyPgColumn } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

export const folders = pgTable(
  "folders",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    parentId: text("parent_id").references((): AnyPgColumn => folders.id, { onDelete: "cascade" }),
    starred: boolean("starred").notNull().default(false),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("folders_owner_id_idx").on(table.ownerId),
    index("folders_parent_id_idx").on(table.parentId),
  ],
);
