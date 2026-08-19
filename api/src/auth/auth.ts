import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import { env } from "../env.js";
import * as schema from "../db/schema/index.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.WEB_ORIGIN],
  emailAndPassword: {
    enabled: true,
    // No transactional email provider wired up for this assignment;
    // accounts are usable immediately after registering.
    requireEmailVerification: false,
    minPasswordLength: 8,
    // Same reason: no email provider, so the reset link is logged instead
    // of emailed. The link itself is real (a valid single-use token via
    // Better Auth's own verification flow) — only the delivery channel is
    // a stand-in for a real mail service.
    sendResetPassword: async ({ user, url }) => {
      console.log(`[password reset] ${user.email}: ${url}`);
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  session: {
    // Signs the session into a short-lived cookie so get-session reads skip
    // the DB round trip — the client's useSession() then resolves near
    // instantly on every page load instead of blocking on a fresh query.
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    // The Next.js app proxies /api/* to this service (see web/next.config.ts
    // rewrites), so the browser always talks to its own origin and the
    // session cookie stays first-party — no cross-site cookie dance needed.
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
