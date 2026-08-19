import { describe, it, expect, vi, beforeEach } from "vitest";

// The tool-calling loop is orchestration logic — mock its three
// collaborators (DB, OpenRouter, S3) so these tests exercise only the
// loop's own decisions: when it pauses for confirmation, when it executes
// immediately, and that ownership is enforced.
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

vi.mock("../src/lib/openrouter.js", () => ({
  openrouter: { chat: { completions: { create: vi.fn() } } },
  ASSISTANT_MODEL: "test-model",
}));

const { db } = await import("../src/db/index.js");
const { openrouter } = await import("../src/lib/openrouter.js");
const assistantService = await import("../src/services/assistant.service.js");

const OWNER_ID = "user-owner";
const OTHER_ID = "user-intruder";

function conversationRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "conv-1",
    ownerId: OWNER_ID,
    title: "Existing conversation",
    pendingToolCalls: null,
    pendingAssistantMessageId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function fileRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "file-1",
    ownerId: OWNER_ID,
    originalName: "resume.pdf",
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

// Chainable stand-in for Drizzle's fluent query builder, matching
// files.authz.test.ts / folders-trash.test.ts.
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

function textChunks(text: string) {
  return [{ choices: [{ delta: { content: text } }] }];
}

function toolCallChunks(id: string, name: string, args: string) {
  return [
    { choices: [{ delta: { tool_calls: [{ index: 0, id, type: "function", function: { name, arguments: "" } }] } }] },
    { choices: [{ delta: { tool_calls: [{ index: 0, function: { arguments: args } }] } }] },
  ];
}

async function collect<T>(gen: AsyncGenerator<T>): Promise<T[]> {
  const events: T[] = [];
  for await (const event of gen) events.push(event);
  return events;
}

beforeEach(() => {
  vi.mocked(db.select).mockReset();
  vi.mocked(db.insert).mockReset().mockReturnValue(chainable(undefined));
  vi.mocked(db.update).mockReset().mockReturnValue(chainable(undefined));
  vi.mocked(openrouter.chat.completions.create).mockReset();
});

describe("conversation ownership", () => {
  it("returns the conversation when the requester owns it", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([conversationRow()]));

    const conversation = await assistantService.getOwnedConversationOrThrow("conv-1", OWNER_ID);

    expect(conversation.id).toBe("conv-1");
  });

  it("throws forbidden when a different user requests it", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([conversationRow()]));

    await expect(assistantService.getOwnedConversationOrThrow("conv-1", OTHER_ID)).rejects.toMatchObject({
      status: 403,
    });
  });

  it("throws not found when the conversation doesn't exist", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([]));

    await expect(assistantService.getOwnedConversationOrThrow("missing", OWNER_ID)).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("postMessage", () => {
  it("streams tokens and persists a plain-text reply with no tool calls", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([conversationRow()])) // title-check lookup
      .mockReturnValueOnce(chainable([])); // buildHistory
    vi.mocked(openrouter.chat.completions.create).mockResolvedValueOnce(textChunks("Sure thing!") as any);

    const events = await collect(assistantService.postMessage("conv-1", OWNER_ID, "hi"));

    expect(events).toEqual([{ type: "token", data: "Sure thing!" }, { type: "done" }]);
    expect(db.insert).toHaveBeenCalledTimes(2); // user message + assistant reply
    expect(db.update).toHaveBeenCalledTimes(1); // conversation updatedAt touch
  });

  it("pauses for confirmation instead of executing a destructive tool call", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([conversationRow()])) // title-check lookup
      .mockReturnValueOnce(chainable([])) // buildHistory
      .mockReturnValueOnce(chainable([fileRow()])); // file lookup for the confirmation summary
    vi.mocked(openrouter.chat.completions.create).mockResolvedValueOnce(
      toolCallChunks("call_1", "trash_file", '{"fileId":"file-1"}') as any,
    );

    const events = await collect(assistantService.postMessage("conv-1", OWNER_ID, "trash my resume"));

    expect(events).toHaveLength(1);
    expect(events[0]!.type).toBe("pending_confirmation");
    expect((events[0] as any).data.summary).toContain("resume.pdf");
    // conversation touch (title/updatedAt) + pendingToolCalls set; trash_file itself must NOT have run.
    expect(db.update).toHaveBeenCalledTimes(2);
  });
});

describe("confirmPendingAction", () => {
  const pendingCall = {
    id: "call_1",
    type: "function" as const,
    function: { name: "star_file", arguments: '{"fileId":"file-1","starred":true}' },
  };

  it("throws bad_request when nothing is pending", async () => {
    vi.mocked(db.select).mockReturnValue(chainable([conversationRow({ pendingToolCalls: null })]));

    const gen = assistantService.confirmPendingAction("conv-1", OWNER_ID, true);

    await expect(gen.next()).rejects.toMatchObject({ status: 400 });
  });

  it("approve: executes the pending tool, clears the pending state, and resumes", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([conversationRow({ pendingToolCalls: [pendingCall] })])) // ownership check
      .mockReturnValueOnce(chainable([fileRow()])) // getOwnedFileOrThrow inside updateFile
      .mockReturnValueOnce(chainable([])); // buildHistory for the resumed loop
    vi.mocked(openrouter.chat.completions.create).mockResolvedValueOnce(textChunks("Starred it.") as any);

    const events = await collect(assistantService.confirmPendingAction("conv-1", OWNER_ID, true));

    expect(events).toEqual([{ type: "token", data: "Starred it." }, { type: "done" }]);
    // tool-result message + final assistant message
    expect(db.insert).toHaveBeenCalledTimes(2);
    // file update (inside star_file) + clearing pendingToolCalls
    expect(db.update).toHaveBeenCalledTimes(2);
  });

  it("decline: records the refusal without touching the file, then resumes", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(chainable([conversationRow({ pendingToolCalls: [pendingCall] })])) // ownership check
      .mockReturnValueOnce(chainable([])); // buildHistory for the resumed loop
    vi.mocked(openrouter.chat.completions.create).mockResolvedValueOnce(textChunks("Okay, left it alone.") as any);

    const events = await collect(assistantService.confirmPendingAction("conv-1", OWNER_ID, false));

    expect(events).toEqual([{ type: "token", data: "Okay, left it alone." }, { type: "done" }]);
    // no file lookup/update from star_file - only the clear-pending update
    expect(db.update).toHaveBeenCalledTimes(1);
  });
});
