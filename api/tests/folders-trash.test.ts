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

vi.mock("../src/lib/s3.js", () => ({
  presignUpload: vi.fn(async () => "https://s3.example/upload"),
  presignDownload: vi.fn(async () => "https://s3.example/download"),
  headObject: vi.fn(async () => ({ exists: true, size: 1024, contentType: "text/plain" })),
  deleteObject: vi.fn(async () => undefined),
}));

const { db } = await import("../src/db/index.js");
const { getOwnedFolderOrThrow, walkDescendants } = await import("../src/services/folders.service.js");
const { isTrashRoot } = await import("../src/services/trash.service.js");

const OWNER_ID = "user-owner";
const OTHER_ID = "user-intruder";

function folderRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "folder-1",
    ownerId: OWNER_ID,
    name: "Documents",
    parentId: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
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

describe("folder ownership enforcement", () => {
  it("returns the folder when the requester owns it", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([folderRow()]));

    const folder = await getOwnedFolderOrThrow("folder-1", OWNER_ID);

    expect(folder.id).toBe("folder-1");
  });

  it("throws forbidden when a different user requests it", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([folderRow()]));

    await expect(getOwnedFolderOrThrow("folder-1", OTHER_ID)).rejects.toMatchObject({
      status: 403,
      code: "forbidden",
    });
  });

  it("throws not found when the folder doesn't exist", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]));

    await expect(getOwnedFolderOrThrow("missing", OWNER_ID)).rejects.toMatchObject({
      status: 404,
      code: "not_found",
    });
  });
});

describe("walkDescendants", () => {
  it("collects every level of a multi-level tree, not just direct children", async () => {
    // root -> [a, b] -> a -> [c] -> (c has no children)
    const levels = [["a", "b"], ["c"], []];
    let call = 0;
    const fetchChildren = vi.fn(async () => levels[call++] ?? []);

    const ids = await walkDescendants(["root"], fetchChildren);

    expect(ids.sort()).toEqual(["a", "b", "c"]);
    expect(fetchChildren).toHaveBeenCalledTimes(3);
  });

  it("terminates immediately for a leaf with no children", async () => {
    const fetchChildren = vi.fn(async () => []);

    const ids = await walkDescendants(["leaf"], fetchChildren);

    expect(ids).toEqual([]);
    expect(fetchChildren).toHaveBeenCalledTimes(1);
  });
});

describe("isTrashRoot", () => {
  it("treats a top-level trashed item as a root", () => {
    expect(isTrashRoot(null, new Set())).toBe(true);
  });

  it("treats an independently-trashed item as a root", () => {
    expect(isTrashRoot("active-parent", new Set(["some-other-folder"]))).toBe(true);
  });

  it("excludes an item whose parent folder was also trashed (cascade, not its own event)", () => {
    expect(isTrashRoot("trashed-parent", new Set(["trashed-parent"]))).toBe(false);
  });
});
