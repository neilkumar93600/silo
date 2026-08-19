import { pgTable, text, timestamp, jsonb, index, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

export const messageRole = pgEnum("message_role", ["user", "assistant", "tool"]);

export interface AssistantToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export const conversations = pgTable(
  "conversations",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title"),
    // Set while a model-proposed tool call awaits user confirmation; null
    // the rest of the time. Blocks new messages until resolved (see
    // assistant.service.ts) so at most one confirmation is ever pending.
    pendingToolCalls: jsonb("pending_tool_calls").$type<AssistantToolCall[]>(),
    pendingAssistantMessageId: text("pending_assistant_message_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("conversations_owner_id_idx").on(table.ownerId)],
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRole("role").notNull(),
    content: text("content"),
    // Set on assistant messages that call tools (OpenAI wire format).
    toolCalls: jsonb("tool_calls").$type<AssistantToolCall[]>(),
    // Set on tool-role messages: which call this is the result of.
    toolCallId: text("tool_call_id"),
    toolName: text("tool_name"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("messages_conversation_id_idx").on(table.conversationId)],
);
