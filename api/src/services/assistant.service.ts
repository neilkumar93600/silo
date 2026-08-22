import { randomUUID } from "node:crypto";
import { asc, desc, eq } from "drizzle-orm";
import type OpenAI from "openai";
import { db } from "../db/index.js";
import { conversations, messages, type AssistantToolCall } from "../db/schema/assistant.js";
import { gemini, ASSISTANT_MODEL } from "../lib/gemini.js";
import { ASSISTANT_TOOLS, requiresConfirmation, executeTool, summarizeToolCall } from "../lib/assistant-tools.js";
import { Errors } from "../lib/errors.js";

const MAX_TOOL_STEPS = 6;

const SYSTEM_PROMPT = `You are Silvi, the intelligent AI assistant built into Silo, a personal cloud file and folder storage app.
You help the user find files, organize and manage folders (create folders, rename, move, trash, restore), inspect storage usage and breakdown (total used, largest files, media types), and perform file actions (move, rename, star/unstar, trash, restore from trash, get share link, share by email, and set visibility).

Key tools and behaviors:
- When the user asks about storage space, quota, disk usage, large files, or storage breakdown, ALWAYS call the "get_storage_usage" tool first.
- When the user wants to see their folders or directory structure, call "list_folders".
- When creating a folder, call "create_folder". If a parent folder was specified by name, call "list_folders" first to find its ID.
- When renaming a folder, call "rename_folder".
- When moving a folder, call "move_folder".
- When trashing a folder, call "trash_folder".
- When searching or finding files, use "search_files". Prefer searching before acting so you act on the right file. When multiple files could match a description, list them and ask which one instead of guessing.

trash_file, trash_folder, share_file, and set_visibility(public) are sensitive: the app pauses and shows the user a confirm/cancel prompt automatically before they run. So when the user asks for one of these, just call the tool right away - do not ask "are you sure?" in words yourself first.

After a tool call, base your reply strictly on that tool's actual result content - never assume a call succeeded. If the result says "The user declined this action", the action was NOT performed: say plainly that you did not do it. If a result starts with "Error:", report the error.

Format replies nicely with markdown: bold headings, clean bullet points, or lists where helpful. Keep responses clear, helpful, and concise.`;

export type ConversationRow = typeof conversations.$inferSelect;
export type MessageRow = typeof messages.$inferSelect;

export type AssistantEvent =
  | { type: "token"; data: string }
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

const FALLBACK_MODELS = [
  ASSISTANT_MODEL,
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
];

async function createStreamWithFallback(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
) {
  const models = Array.from(new Set(FALLBACK_MODELS));
  let lastError: unknown;
  for (const model of models) {
    try {
      const stream = await gemini.chat.completions.create({
        model,
        messages,
        tools: ASSISTANT_TOOLS,
        stream: true,
      });
      return stream;
    } catch (err) {
      lastError = err;
      console.warn(
        `[Assistant] Gemini model ${model} failed (${err instanceof Error ? err.message : err}), attempting fallback model...`,
      );
    }
  }
  throw lastError;
}

async function* runLoop(conversationId: string, ownerId: string): AsyncGenerator<AssistantEvent> {
  try {
    for (let step = 0; step < MAX_TOOL_STEPS; step++) {
      const history = await buildHistory(conversationId);
      const stream = await createStreamWithFallback(history);

      let content = "";
      const toolCallAcc: { id?: string; type?: "function"; function: { name: string; arguments: string } }[] = [];

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        if (delta?.content) {
          content += delta.content;
          yield { type: "token", data: delta.content };
        }
        for (const tcDelta of delta?.tool_calls ?? []) {
          const idx = tcDelta.index;
          if (!toolCallAcc[idx]) toolCallAcc[idx] = { function: { name: "", arguments: "" } };
          if (tcDelta.id) toolCallAcc[idx]!.id = tcDelta.id;
          if (tcDelta.type === "function") toolCallAcc[idx]!.type = tcDelta.type;
          if (tcDelta.function?.name) toolCallAcc[idx]!.function.name += tcDelta.function.name;
          if (tcDelta.function?.arguments) toolCallAcc[idx]!.function.arguments += tcDelta.function.arguments;
        }
      }

      const toolCalls = toolCallAcc.filter((c): c is AssistantToolCall => Boolean(c?.id)) as AssistantToolCall[];

      if (toolCalls.length === 0) {
        await db.insert(messages).values({
          id: randomUUID(),
          conversationId,
          role: "assistant",
          content: content || null,
        });
        yield { type: "done" };
        return;
      }

      const assistantMessageId = randomUUID();
      await db.insert(messages).values({
        id: assistantMessageId,
        conversationId,
        role: "assistant",
        content: content || null,
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

async function buildHistory(conversationId: string): Promise<OpenAI.Chat.Completions.ChatCompletionMessageParam[]> {
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  const history: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{ role: "system", content: SYSTEM_PROMPT }];

  for (const row of rows) {
    if (row.role === "tool") {
      history.push({ role: "tool", tool_call_id: row.toolCallId!, content: row.content ?? "" });
    } else if (row.role === "assistant") {
      history.push({
        role: "assistant",
        content: row.content,
        ...(row.toolCalls && row.toolCalls.length > 0 ? { tool_calls: row.toolCalls } : {}),
      });
    } else {
      history.push({ role: "user", content: row.content ?? "" });
    }
  }

  return history;
}
