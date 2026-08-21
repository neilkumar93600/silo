import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import { env } from "../env.js";
import * as schema from "../db/schema/index.js";
import { sendMail } from "../lib/mail.js";

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
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendMail(
        user.email,
        "Reset your Silo password",
        `<p>Reset your password: <a href="${url}">${url}</a></p><p>If you didn't request this, ignore this email.</p>`,
      );
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail(
        user.email,
        "Verify your Silo email",
        `<p>Confirm your email: <a href="${url}">${url}</a></p>`,
      );
    },
    autoSignInAfterVerification: true,
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
