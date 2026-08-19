import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/db/index.js", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  pool: {},
}));

const { db } = await import("../src/db/index.js");
const { listNotifications, markRead, markAllRead, remove, createNotification } = await import(
  "../src/services/notifications.service.js"
);

const USER_ID = "user-1";
const OTHER_ID = "user-2";

function notificationRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "notif-1",
    userId: USER_ID,
    actorId: "user-actor",
    type: "file_shared",
    title: "Someone shared a file with you",
    body: "report.pdf",
    fileId: "file-1",
    read: false,
    createdAt: new Date(),
    ...overrides,
  };
}

function chainable(result: unknown) {
  const proxy: any = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") {
          return (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
            Promise.resolve(result).then(resolve, reject);
        }
        return () => proxy;
      },
    },
  );
  return proxy;
}

beforeEach(() => {
  vi.mocked(db.select).mockReset();
  vi.mocked(db.insert).mockReset();
  vi.mocked(db.update).mockReset();
  vi.mocked(db.delete).mockReset();
});

describe("listNotifications", () => {
  it("returns items alongside an accurate unread count", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([notificationRow(), notificationRow({ id: "notif-2", read: true })])) // items
      .mockReturnValueOnce(chainable([{ value: 1 }])); // unread count

    const result = await listNotifications(USER_ID);

    expect(result.items).toHaveLength(2);
    expect(result.unreadCount).toBe(1);
  });
});

describe("markRead", () => {
  it("throws not-found when the notification doesn't belong to the caller", async () => {
    vi.mocked(db.update).mockReturnValueOnce(chainable([]));

    await expect(markRead("notif-1", OTHER_ID)).rejects.toMatchObject({ status: 404 });
  });

  it("marks the caller's own notification read", async () => {
    vi.mocked(db.update).mockReturnValueOnce(chainable([notificationRow({ read: true })]));

    const updated = await markRead("notif-1", USER_ID);

    expect(updated.read).toBe(true);
  });
});

describe("markAllRead", () => {
  it("updates without throwing", async () => {
    vi.mocked(db.update).mockReturnValueOnce(chainable(undefined));

    await expect(markAllRead(USER_ID)).resolves.toBeUndefined();
  });
});

describe("remove", () => {
  it("throws not-found when the notification doesn't belong to the caller", async () => {
    vi.mocked(db.delete).mockReturnValueOnce(chainable([]));

    await expect(remove("notif-1", OTHER_ID)).rejects.toMatchObject({ status: 404 });
  });

  it("deletes the caller's own notification", async () => {
    vi.mocked(db.delete).mockReturnValueOnce(chainable([notificationRow()]));

    await expect(remove("notif-1", USER_ID)).resolves.toBeUndefined();
  });
});

describe("createNotification", () => {
  it("inserts a row with the given fields", async () => {
    vi.mocked(db.insert).mockReturnValueOnce(chainable(undefined));

    await createNotification({
      userId: USER_ID,
      actorId: "user-actor",
      type: "file_shared",
      title: "title",
      body: "body",
      fileId: "file-1",
    });

    expect(db.insert).toHaveBeenCalledTimes(1);
  });
});
