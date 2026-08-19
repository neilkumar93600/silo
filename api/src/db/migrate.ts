// Standalone migration runner. Deliberately doesn't import env.ts / the
// app's db client — this only needs DATABASE_URL, and requiring the full
// app config (AWS creds, auth secret, etc.) here would make `db:migrate`
// fail on missing settings that have nothing to do with running a migration.
import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run migrations");
}

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool);

await migrate(db, { migrationsFolder: "./drizzle" });
await pool.end();
console.log("Migrations applied.");
