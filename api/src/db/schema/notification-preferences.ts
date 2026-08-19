import { pgTable, text, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

// One row per user, created lazily on first read/write — not seeded at
// signup, since every preference defaults to "on" until touched.
export const notificationPreferences = pgTable("notification_preferences", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  notifyOnFileShared: boolean("notify_on_file_shared").notNull().default(true),
});
