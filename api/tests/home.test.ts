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
const { getHomeFeed } = await import("../src/services/home.service.js");

const OWNER_ID = "user-owner";

function fileRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "file-1",
    ownerId: OWNER_ID,
    folderId: null,
    originalName: "report.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1024,
    s3Key: "uploads/user-owner/file-1",
    visibility: "private",
    status: "uploaded",
    shareSlug: "abc123slug",
    starred: false,
    deletedAt: null,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  };
}

// Chainable stand-in for Drizzle's fluent query builder: every method
// returns itself, and it resolves to `result` when awaited.
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
});

describe("getHomeFeed", () => {
  it("orders by most recent activity: a recently-viewed owned file first, then a newer shared file, then an older untouched owned file", async () => {
    const ownedOld = fileRow({ id: "owned-old", createdAt: new Date("2026-01-01T00:00:00Z") });
    const ownedViewed = fileRow({ id: "owned-viewed", createdAt: new Date("2026-01-02T00:00:00Z") });
    const sharedRow = fileRow({ id: "shared-1", ownerId: "user-other" });

    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([ownedOld, ownedViewed])) // owned files
      .mockReturnValueOnce(
        chainable([
          {
            file: sharedRow,
            sharedByName: "Other User",
            sharedByEmail: "other@example.com",
            sharedAt: new Date("2026-01-03T00:00:00Z"),
          },
        ]),
      ) // listSharedWithMe's query
      .mockReturnValueOnce(
        chainable([{ id: "v1", userId: OWNER_ID, fileId: "owned-viewed", viewedAt: new Date("2026-01-10T00:00:00Z") }]),
      ); // file_views

    const result = await getHomeFeed(OWNER_ID);

    expect(result.files.map((f) => f.id)).toEqual(["owned-viewed", "shared-1", "owned-old"]);
  });

  it("excludes a self-share from the shared bucket so the owned copy isn't duplicated", async () => {
    const owned = fileRow({ id: "file-1" });

    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([owned])) // owned files
      .mockReturnValueOnce(
        chainable([{ file: owned, sharedByName: "Self", sharedByEmail: "self@example.com", sharedAt: new Date() }]),
      ) // listSharedWithMe returns the same file (shared with own email, edge case)
      .mockReturnValueOnce(chainable([])); // file_views

    const result = await getHomeFeed(OWNER_ID);

    expect(result.files.map((f) => f.id)).toEqual(["file-1"]);
  });
});
