import { Router, type Response } from "express";
import { authRequired } from "../middleware/auth-required.js";
import { assistantRateLimit } from "../middleware/rate-limit.js";
import { sendMessageSchema, confirmActionSchema } from "../lib/validation.js";
import { AppError, Errors } from "../lib/errors.js";
import * as assistantService from "../services/assistant.service.js";
import type { AssistantEvent } from "../services/assistant.service.js";

export const assistantRouter = Router();

assistantRouter.use(authRequired);

function writeSSE(res: Response, event: AssistantEvent) {
  res.write(`event: ${event.type}\ndata: ${JSON.stringify(event.data ?? null)}\n\n`);
  if (typeof (res as any).flush === "function") {
    (res as any).flush();
  }
}

async function streamEvents(res: Response, generator: AsyncGenerator<AssistantEvent>) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
  for await (const event of generator) {
    writeSSE(res, event);
  }
  res.end();
}

assistantRouter.get("/conversations", async (req, res, next) => {
  try {
    res.json(await assistantService.listConversations(req.userId));
  } catch (err) {
    next(err);
  }
});

assistantRouter.post("/conversations", async (req, res, next) => {
  try {
    const conversation = await assistantService.createConversation(req.userId);
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
});

assistantRouter.get("/conversations/:id", async (req, res, next) => {
  try {
    const conversation = await assistantService.getOwnedConversationOrThrow(req.params.id!, req.userId);
    const pending = await assistantService.getPendingConfirmation(conversation);
    res.json({ ...conversation, pending });
  } catch (err) {
    next(err);
  }
});

assistantRouter.get("/conversations/:id/messages", async (req, res, next) => {
  try {
    res.json(await assistantService.getMessages(req.params.id!, req.userId));
  } catch (err) {
    next(err);
  }
});

assistantRouter.delete("/conversations/:id", async (req, res, next) => {
  try {
    await assistantService.deleteConversation(req.params.id!, req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

assistantRouter.post("/conversations/:id/messages", assistantRateLimit, async (req, res, next) => {
  try {
    const body = sendMessageSchema.parse(req.body);
    const conversation = await assistantService.getOwnedConversationOrThrow(String(req.params.id), req.userId);
    if (conversation.pendingToolCalls && conversation.pendingToolCalls.length > 0) {
      throw Errors.conflict("Resolve the pending confirmation before sending a new message");
    }

    await streamEvents(res, assistantService.postMessage(conversation.id, req.userId, body.content));
  } catch (err) {
    if (res.headersSent) {
      writeSSE(res, { type: "error", data: err instanceof AppError ? err.message : "Something went wrong" });
      res.end();
      return;
    }
    next(err);
  }
});

assistantRouter.post("/conversations/:id/confirm", assistantRateLimit, async (req, res, next) => {
  try {
    const body = confirmActionSchema.parse(req.body);
    const conversation = await assistantService.getOwnedConversationOrThrow(String(req.params.id), req.userId);
    if (!conversation.pendingToolCalls || conversation.pendingToolCalls.length === 0) {
      throw Errors.badRequest("No pending confirmation on this conversation");
    }

    await streamEvents(res, assistantService.confirmPendingAction(conversation.id, req.userId, body.approve));
  } catch (err) {
    if (res.headersSent) {
      writeSSE(res, { type: "error", data: err instanceof AppError ? err.message : "Something went wrong" });
      res.end();
      return;
    }
    next(err);
  }
});
