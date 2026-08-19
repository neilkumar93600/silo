import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notificationPreferences } from "../db/schema/notification-preferences.js";

export async function getPreferences(userId: string) {
  const [row] = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);

  return row ?? { userId, notifyOnFileShared: true };
}

export async function updatePreferences(userId: string, patch: { notifyOnFileShared?: boolean }) {
  const [row] = await db
    .insert(notificationPreferences)
    .values({ userId, ...patch })
    .onConflictDoUpdate({ target: notificationPreferences.userId, set: patch })
    .returning();

  return row;
}
