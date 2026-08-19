import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { toNodeHandler } from "better-auth/node";
import { env } from "./env.js";
import { auth } from "./auth/auth.js";
import { filesRouter } from "./routes/files.js";
import { foldersRouter } from "./routes/folders.js";
import { trashRouter } from "./routes/trash.js";
import { starredRouter } from "./routes/starred.js";
import { sharedRouter } from "./routes/shared.js";
import { shareRouter } from "./routes/share.js";
import { authRateLimit } from "./middleware/rate-limit.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(pinoHttp({ redact: ["req.headers.cookie", "req.headers.authorization"] }));

  // Better Auth owns request parsing for its own routes — it must be
  // mounted before express.json() touches the body.
  app.use("/api/auth", authRateLimit);
  app.all("/api/auth/*", toNodeHandler(auth));

  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/files", filesRouter);
  app.use("/api/folders", foldersRouter);
  app.use("/api/trash", trashRouter);
  app.use("/api/starred", starredRouter);
  app.use("/api/shared-with-me", sharedRouter);
  app.use("/api/share", shareRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
