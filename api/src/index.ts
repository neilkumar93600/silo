import { createApp } from "./app.js";
import { env } from "./env.js";
import { pool } from "./db/index.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`api listening on :${env.PORT}`);
});

// Let in-flight requests finish and close the DB pool before exiting, so an
// orchestrator SIGTERM (deploy/rollout) doesn't drop live connections.
async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    pool.end().then(() => process.exit(0));
  });
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
