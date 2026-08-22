import { randomUUID } from "node:crypto";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { conversations, messages, type AssistantToolCall } from "../db/schema/assistant.js";
import { streamChat } from "../lib/muapi.js";
import { ASSISTANT_TOOLS, requiresConfirmation, executeTool, summarizeToolCall } from "../lib/assistant-tools.js";
import { Errors } from "../lib/errors.js";

const MAX_TOOL_STEPS = 6;

// MuAPI's kimi-k3 endpoint takes a single prompt + system_prompt (no
// messages array, no native tool-calling - verified against its OpenAPI
// spec). Tool definitions are rendered into the system prompt instead, and
// the model is instructed to request a call via a <tool_call> block that we
// parse out of the plain-text reply ourselves.
function formatToolCatalog(): string {
  return ASSISTANT_TOOLS.map((t) => {
    const { name, description, parameters } = t.function;
    const props = (parameters as { properties?: Record<string, { type?: string | string[]; enum?: string[] }> })
      .properties ?? {};
    const required = (parameters as { required?: string[] }).required ?? [];
    const args = Object.entries(props)
      .map(([key, schema]) => {
        const type = schema.enum
          ? schema.enum.map((v) => JSON.stringify(v)).join("|")
          : Array.isArray(schema.type)
            ? schema.type.join("|")
            : schema.type;
        return `${key}${required.includes(key) ? "" : "?"}: ${type}`;
      })
      .join(", ");
    return `- ${name}(${args}) - ${description}`;
  }).join("\n");
}

const TOOL_CATALOG = formatToolCatalog();

const SYSTEM_PROMPT = `You are Silvi, the AI assistant built into Silo, a personal cloud file and folder storage app. You find files, manage folders, report storage usage, and act on files/folders for the user. You have no capabilities outside the tools below - don't answer unrelated questions as if you did.

## Tools
${TOOL_CATALOG}

Discovery tools (get_storage_usage, list_folders, search_files) resolve names to ids - call one whenever the user names a file or folder by name instead of id. Always search_files before acting on a file named in words; if more than one result could match, list the candidates and ask which one instead of guessing an id.

Known limitation: search_files and list_folders only return items that are NOT in trash, so there is no tool to look up the id of a trashed file or folder. If the user asks to restore something and you don't already have its id from earlier in this conversation, say you can't currently browse trash to find it - never invent an id.

## Sharing a file
- Share with a specific person -> share_file (their email).
- Share a public link -> set_visibility(fileId, "public") first if the file isn't already public, then get_share_link. get_share_link returns a link even for a private file, but that link won't work for anyone else until the file is public.

## Calling a tool
To call a tool, respond with ONLY one or more blocks of this exact form and nothing else - no other text before, between, or after:
<tool_call>{"name": "<tool name>", "arguments": {<json arguments>}}</tool_call>

Never invent a tool name or argument not listed above. Arguments must be valid JSON matching the tool's parameters. If you are not calling a tool, respond normally in plain text and never include a <tool_call> block.

## Confirmation
trash_file, trash_folder, share_file, and set_visibility(public) are sensitive: the app automatically pauses and shows the user its own confirm/cancel prompt before running them. When the user asks for one of these, call the tool right away - don't ask "are you sure?" in words yourself first.

## After a tool result
You'll see prior tool calls and their results in the conversation transcript below. Base your reply strictly on a tool's actual result content - never assume it succeeded. "The user declined this action" means it did NOT happen: say so plainly. A result starting with "Error:" means report that error, don't retry silently or claim success.

## Format
Markdown: bold headings, clean bullets/lists where they help. Keep replies clear, helpful, and concise.`;

export type ConversationRow = typeof conversations.$inferSelect;
export type MessageRow = typeof messages.$inferSelect;

export type AssistantEvent =
  | { type: "token"; data: string }
  // No-op ping so the client (and any proxy in between) sees the connection
  // is alive during kimi-k3's long reasoning phase, before real content exists.
  | { type: "heartbeat"; data?: undefined }
  | { type: "pending_confirmation"; data: { summary: string; calls: AssistantToolCall[] } }
  | { type: "done"; data?: undefined }
  | { type: "error"; data: string };

export async function listConversations(ownerId: string) {
  return db
    .select({ id: conversations.id, title: conversations.title, updatedAt: conversations.updatedAt })
    .from(conversations)
    .where(eq(conversations.ownerId, ownerId))
    .orderBy(desc(conversations.updatedAt));
}

export async function createConversation(ownerId: string): Promise<ConversationRow> {
  const [row] = await db
    .insert(conversations)
    .values({ id: randomUUID(), ownerId })
    .returning();
  return row!;
}

export async function getOwnedConversationOrThrow(id: string, ownerId: string): Promise<ConversationRow> {
  const [row] = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  if (!row) throw Errors.notFound("Conversation");
  if (row.ownerId !== ownerId) throw Errors.forbidden();
  return row;
}

export async function deleteConversation(id: string, ownerId: string) {
  await getOwnedConversationOrThrow(id, ownerId);
  await db.delete(conversations).where(eq(conversations.id, id));
}

export async function getMessages(conversationId: string, ownerId: string): Promise<MessageRow[]> {
  await getOwnedConversationOrThrow(conversationId, ownerId);
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));
}

// Recomputed on demand (never stored) so a page reload after a pending
// confirmation shows the same card without a stale cached summary.
export async function getPendingConfirmation(conversation: ConversationRow) {
  if (!conversation.pendingToolCalls || conversation.pendingToolCalls.length === 0) return null;
  const summaries = await Promise.all(
    conversation.pendingToolCalls.map((call) => summarizeToolCall(call, conversation.ownerId)),
  );
  return { summary: summaries.join("; "), calls: conversation.pendingToolCalls };
}

export async function* postMessage(
  conversationId: string,
  ownerId: string,
  content: string,
): AsyncGenerator<AssistantEvent> {
  const now = new Date();
  await db.insert(messages).values({ id: randomUUID(), conversationId, role: "user", content, createdAt: now });

  const [conversation] = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
  if (conversation && !conversation.title) {
    await db
      .update(conversations)
      .set({ title: content.slice(0, 60), updatedAt: now })
      .where(eq(conversations.id, conversationId));
  } else {
    await db.update(conversations).set({ updatedAt: now }).where(eq(conversations.id, conversationId));
  }

  yield* runLoop(conversationId, ownerId);
}

export async function* confirmPendingAction(
  conversationId: string,
  ownerId: string,
  approve: boolean,
): AsyncGenerator<AssistantEvent> {
  const conversation = await getOwnedConversationOrThrow(conversationId, ownerId);
  if (!conversation.pendingToolCalls || conversation.pendingToolCalls.length === 0) {
    throw Errors.badRequest("No pending confirmation on this conversation");
  }

  for (const call of conversation.pendingToolCalls) {
    const content = approve ? await runConfirmedTool(call, ownerId) : "The user declined this action.";
    await db.insert(messages).values({
      id: randomUUID(),
      conversationId,
      role: "tool",
      content,
      toolCallId: call.id,
      toolName: call.function.name,
    });
  }

  await db
    .update(conversations)
    .set({ pendingToolCalls: null, pendingAssistantMessageId: null, updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  yield* runLoop(conversationId, ownerId);
}

async function runConfirmedTool(call: AssistantToolCall, ownerId: string): Promise<string> {
  try {
    const args = JSON.parse(call.function.arguments || "{}");
    const result = await executeTool(call.function.name, args, ownerId);
    return JSON.stringify(result ?? { ok: true });
  } catch (err) {
    return `Error: ${err instanceof Error ? err.message : "tool call failed"}`;
  }
}

const TOOL_CALL_RE = /<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/g;

// The model must reply with either plain text or one-or-more <tool_call>
// blocks and nothing else (see SYSTEM_PROMPT) - there's no native
// tool-calling API on MuAPI to enforce that for us.
function parseModelReply(raw: string): { content: string | null; toolCalls: AssistantToolCall[] } {
  const toolCalls: AssistantToolCall[] = [];
  let match: RegExpExecArray | null;
  TOOL_CALL_RE.lastIndex = 0;
  while ((match = TOOL_CALL_RE.exec(raw))) {
    const body = match[1]!
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    try {
      const parsed = JSON.parse(body);
      if (parsed && typeof parsed.name === "string") {
        toolCalls.push({
          id: randomUUID(),
          type: "function",
          function: { name: parsed.name, arguments: JSON.stringify(parsed.arguments ?? {}) },
        });
      }
    } catch {
      // Model emitted malformed tool_call JSON - drop it rather than crash the turn.
    }
  }
  const remaining = raw.replace(TOOL_CALL_RE, "").trim();
  return { content: remaining.length > 0 ? remaining : null, toolCalls };
}

async function* runLoop(conversationId: string, ownerId: string): AsyncGenerator<AssistantEvent> {
  try {
    for (let step = 0; step < MAX_TOOL_STEPS; step++) {
      const prompt = await buildPrompt(conversationId);
      let raw = "";
      for await (const chunk of streamChat({ prompt, systemPrompt: SYSTEM_PROMPT })) {
        if (chunk.content) raw += chunk.content;
        else yield { type: "heartbeat" };
      }
      const { content, toolCalls } = parseModelReply(raw);

      if (toolCalls.length === 0) {
        // ponytail: no incremental streaming from MuAPI's response shape here (we
        // must buffer the full reply to find/strip <tool_call> blocks first), so
        // this arrives as one token event instead of a live typewriter effect.
        if (content) yield { type: "token", data: content };
        await db.insert(messages).values({
          id: randomUUID(),
          conversationId,
          role: "assistant",
          content: content ?? null,
        });
        yield { type: "done" };
        return;
      }

      const assistantMessageId = randomUUID();
      await db.insert(messages).values({
        id: assistantMessageId,
        conversationId,
        role: "assistant",
        content,
        toolCalls,
      });

      const needsConfirmation = toolCalls.some((call) => {
        let args: unknown = {};
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {
          // treat unparseable args as not requiring confirmation's args check
        }
        return requiresConfirmation(call.function.name, args);
      });

      if (needsConfirmation) {
        await db
          .update(conversations)
          .set({ pendingToolCalls: toolCalls, pendingAssistantMessageId: assistantMessageId, updatedAt: new Date() })
          .where(eq(conversations.id, conversationId));

        const summaries = await Promise.all(toolCalls.map((call) => summarizeToolCall(call, ownerId)));
        yield { type: "pending_confirmation", data: { summary: summaries.join("; "), calls: toolCalls } };
        return;
      }

      for (const call of toolCalls) {
        const resultContent = await runConfirmedTool(call, ownerId);
        await db.insert(messages).values({
          id: randomUUID(),
          conversationId,
          role: "tool",
          content: resultContent,
          toolCallId: call.id,
          toolName: call.function.name,
        });
      }
      // loop again so the model can see the tool results and respond
    }

    yield { type: "error", data: "The assistant took too many steps on that request - try rephrasing it." };
  } catch (err) {
    yield { type: "error", data: err instanceof Error ? err.message : "Something went wrong" };
  }
}

async function buildPrompt(conversationId: string): Promise<string> {
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  const lines: string[] = [];
  for (const row of rows) {
    if (row.role === "user") {
      lines.push(`User: ${row.content ?? ""}`);
    } else if (row.role === "assistant") {
      for (const call of row.toolCalls ?? []) {
        lines.push(`Assistant called ${call.function.name} with arguments ${call.function.arguments}`);
      }
      if (row.content) lines.push(`Assistant: ${row.content}`);
    } else {
      lines.push(`Tool result (${row.toolName}): ${row.content ?? ""}`);
    }
  }

  return lines.join("\n");
}
