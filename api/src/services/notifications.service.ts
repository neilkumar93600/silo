import { randomUUID } from "node:crypto";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notifications } from "../db/schema/notifications.js";
import { Errors } from "../lib/errors.js";

const LIST_LIMIT = 50;

export async function listNotifications(userId: string) {
  const [items, [unread]] = await Promise.all([
    db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(LIST_LIMIT),
    db
      .select({ value: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false))),
  ]);

  return { items, unreadCount: unread?.value ?? 0 };
}

export async function markRead(id: string, userId: string) {
  const [updated] = await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    .returning();

  if (!updated) throw Errors.notFound("Notification");
  return updated;
}

export async function markAllRead(userId: string) {
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));
}

export async function remove(id: string, userId: string) {
  const [deleted] = await db
    .delete(notifications)
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    .returning();

  if (!deleted) throw Errors.notFound("Notification");
}

export async function createNotification(params: {
  userId: string;
  actorId?: string;
  type: string;
  title: string;
  body: string;
  fileId?: string;
}) {
  await db.insert(notifications).values({
    id: randomUUID(),
    userId: params.userId,
    actorId: params.actorId ?? null,
    type: params.type,
    title: params.title,
    body: params.body,
    fileId: params.fileId ?? null,
  });
}
