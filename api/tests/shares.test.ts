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
const { addShare, removeShare, listShares, listSharedWithMe } = await import("../src/services/shares.service.js");

const OWNER_ID = "user-owner";
const OTHER_ID = "user-intruder";
const RECIPIENT_ID = "user-recipient";

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
    starred: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function userRow(overrides: Record<string, unknown> = {}) {
  return {
    id: RECIPIENT_ID,
    name: "Recipient Name",
    email: "recipient@example.com",
    emailVerified: false,
    image: null,
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

describe("addShare", () => {
  it("blocks a non-owner from sharing someone else's file", async () => {
    vi.mocked(db.select).mockReturnValueOnce(chainable([fileRow()]));

    await expect(addShare("file-1", OTHER_ID, "recipient@example.com")).rejects.toMatchObject({
      status: 403,
    });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("rejects an email with no matching Silo user", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([fileRow()])) // getOwnedFileOrThrow
      .mockReturnValueOnce(chainable([])); // user lookup — no match

    await expect(addShare("file-1", OWNER_ID, "nobody@example.com")).rejects.toMatchObject({
      status: 400,
    });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("inserts a share row when the owner shares with a known user", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([fileRow()])) // addShare's getOwnedFileOrThrow
      .mockReturnValueOnce(chainable([userRow()])) // user lookup — match
      .mockReturnValueOnce(chainable([fileRow()])) // listShares's getOwnedFileOrThrow
      .mockReturnValueOnce(chainable([])); // listShares's actual select
    vi.mocked(db.insert).mockReturnValue(chainable(undefined));

    await addShare("file-1", OWNER_ID, "recipient@example.com");

    expect(db.insert).toHaveBeenCalledTimes(1);
  });
});

describe("removeShare", () => {
  it("blocks a non-owner from revoking access to someone else's file", async () => {
    vi.mocked(db.select).mockReturnValueOnce(chainable([fileRow()]));

    await expect(removeShare("file-1", OTHER_ID, RECIPIENT_ID)).rejects.toMatchObject({
      status: 403,
    });
    expect(db.delete).not.toHaveBeenCalled();
  });

  it("deletes the share row when the owner revokes access", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([fileRow()])) // removeShare's getOwnedFileOrThrow
      .mockReturnValueOnce(chainable([fileRow()])) // listShares's getOwnedFileOrThrow
      .mockReturnValueOnce(chainable([])); // listShares's actual select
    vi.mocked(db.delete).mockReturnValue(chainable(undefined));

    await removeShare("file-1", OWNER_ID, RECIPIENT_ID);

    expect(db.delete).toHaveBeenCalledTimes(1);
  });
});

describe("listShares", () => {
  it("blocks a non-owner from listing shares", async () => {
    vi.mocked(db.select).mockReturnValueOnce(chainable([fileRow()]));

    await expect(listShares("file-1", OTHER_ID)).rejects.toMatchObject({
      status: 403,
    });
  });
});

describe("listSharedWithMe", () => {
  // Note: the `chainable()` mock resolves to whatever result it's given
  // regardless of what conditions are actually passed to `.where(...)`, so
  // this can't spy on the real query and prove a trashed file is excluded
  // at the SQL level. The most this mocking style can meaningfully verify
  // is that a normal (non-trashed) row still comes back correctly shaped —
  // i.e. the query-shape change didn't break the mapping to `sharedBy`.
  it("returns files shared with the user, tagged with who shared them", async () => {
    const row = fileRow();
    vi.mocked(db.select).mockReturnValueOnce(
      chainable([{ file: row, sharedByName: "Owner Name", sharedByEmail: "owner@example.com" }]),
    );

    const result = await listSharedWithMe(RECIPIENT_ID);

    expect(result.files).toEqual([{ ...row, sharedBy: { name: "Owner Name", email: "owner@example.com" } }]);
  });
});
