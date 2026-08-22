import { describe, it, expect, vi, beforeEach } from "vitest";

// The service under test is pure authorization/orchestration logic —
// mock its two collaborators (DB and S3) so these tests exercise only
// "can user B touch user A's file", not Drizzle or AWS wiring.
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
const s3 = await import("../src/lib/s3.js");
const {
  getOwnedFileOrThrow,
  getAccessibleFileOrThrow,
  updateFile,
  trashFile,
  permanentDeleteFile,
  getDownloadUrl,
  getPublicDownloadUrl,
} = await import("../src/services/files.service.js");

const OWNER_ID = "user-owner";
const OTHER_ID = "user-intruder";

function fileRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "file-1",
    ownerId: OWNER_ID,
    originalName: "report.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1024,
    s3Key: "uploads/user-owner/file-1",
    visibility: "private",
    status: "uploaded",
    shareSlug: "abc123slug",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// Chainable stand-in for Drizzle's fluent query builder: every method
// returns itself, and it resolves to `result` when awaited — matching
// how the service calls e.g. db.select().from().where().limit().
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

describe("file ownership enforcement", () => {
  it("returns the file when the requester owns it", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fileRow()]));

    const file = await getOwnedFileOrThrow("file-1", OWNER_ID);

    expect(file.id).toBe("file-1");
  });

  it("throws forbidden (not a generic error) when a different user requests it", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fileRow()]));

    await expect(getOwnedFileOrThrow("file-1", OTHER_ID)).rejects.toMatchObject({
      status: 403,
      code: "forbidden",
    });
  });

  it("throws not found when the file doesn't exist", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]));

    await expect(getOwnedFileOrThrow("missing", OWNER_ID)).rejects.toMatchObject({
      status: 404,
      code: "not_found",
    });
  });

  it("blocks a non-owner from changing visibility", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fileRow()]));

    await expect(updateFile("file-1", OTHER_ID, { visibility: "public" })).rejects.toMatchObject({
      status: 403,
    });
    expect(db.update).not.toHaveBeenCalled();
  });

  it("blocks a non-owner from moving a file to trash", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fileRow()]));

    await expect(trashFile("file-1", OTHER_ID)).rejects.toMatchObject({ status: 403 });
    expect(db.update).not.toHaveBeenCalled();
  });

  it("blocks a non-owner from permanently deleting", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fileRow({ deletedAt: new Date() })]));

    await expect(permanentDeleteFile("file-1", OTHER_ID)).rejects.toMatchObject({ status: 403 });
    expect(s3.deleteObject).not.toHaveBeenCalled();
    expect(db.delete).not.toHaveBeenCalled();
  });

  it("refuses to permanently delete a file that isn't in trash yet", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fileRow({ deletedAt: null })]));

    await expect(permanentDeleteFile("file-1", OWNER_ID)).rejects.toMatchObject({ status: 400 });
    expect(s3.deleteObject).not.toHaveBeenCalled();
  });

  it("blocks a non-owner from getting a private download URL", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([fileRow({ visibility: "private" })])) // file lookup
      .mockReturnValueOnce(chainable([])); // no share row

    await expect(getDownloadUrl("file-1", OTHER_ID)).rejects.toMatchObject({ status: 403 });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("records a view when the owner opens the download URL", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fileRow()]));
    vi.mocked(db.insert).mockReturnValue(chainable(undefined));

    await getDownloadUrl("file-1", OWNER_ID);

    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("records a view when a share recipient opens the download URL", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([fileRow()])) // file lookup
      .mockReturnValueOnce(chainable([{ id: "share-1" }])); // share row exists
    vi.mocked(db.insert).mockReturnValue(chainable(undefined));

    await getDownloadUrl("file-1", OTHER_ID);

    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("getAccessibleFileOrThrow: owner always succeeds", async () => {
    vi.mocked(db.select).mockReturnValueOnce(chainable([fileRow()]));

    const file = await getAccessibleFileOrThrow("file-1", OWNER_ID);

    expect(file.id).toBe("file-1");
  });

  it("getAccessibleFileOrThrow: a user with a share row succeeds", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([fileRow()])) // file lookup
      .mockReturnValueOnce(chainable([{ id: "share-1" }])); // share row exists

    const file = await getAccessibleFileOrThrow("file-1", OTHER_ID);

    expect(file.id).toBe("file-1");
  });

  it("getAccessibleFileOrThrow: a user with no share row is forbidden", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([fileRow()])) // file lookup
      .mockReturnValueOnce(chainable([])); // no share row

    await expect(getAccessibleFileOrThrow("file-1", OTHER_ID)).rejects.toMatchObject({ status: 403 });
  });

  it("blocks moving an owned file into a folder owned by someone else", async () => {
    vi.mocked(db.select).mockReturnValueOnce(chainable([fileRow()])).mockReturnValueOnce(
      chainable([{ id: "folder-1", ownerId: OTHER_ID, name: "Intruder's folder", parentId: null }]),
    );

    await expect(updateFile("file-1", OWNER_ID, { folderId: "folder-1" })).rejects.toMatchObject({
      status: 403,
    });
    expect(db.update).not.toHaveBeenCalled();
  });
});

describe("public share access", () => {
  it("serves a public, fully-uploaded file to anyone (no auth check)", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([fileRow({ visibility: "public" })]));

    const { url } = await getPublicDownloadUrl("abc123slug");

    expect(url).toBe("https://s3.example/download");
  });

  it("404s for a private file's slug instead of leaking that it exists", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]));

    await expect(getPublicDownloadUrl("some-slug")).rejects.toMatchObject({
      status: 404,
      code: "not_found",
    });
  });
});
