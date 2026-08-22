import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import { env } from "../env.js";
import * as schema from "../db/schema/index.js";
import { sendMail } from "../lib/mail.js";
import { verifyOtpEmail, passwordResetEmail } from "../lib/mail-templates.js";

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
      await sendMail(user.email, "Reset your Silo password", passwordResetEmail(url));
    },
  },
  // The emailOTP plugin below overrides sendVerificationEmail to dispatch a
  // 6-digit code instead of a link — this callback never actually fires,
  // but autoSignInAfterVerification still applies to the OTP verify flow.
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 300,
      async sendVerificationOTP({ email, otp }) {
        await sendMail(email, "Verify your Silo email", verifyOtpEmail(otp));
      },
    }),
  ],
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
    // Railway sits in front as a single reverse-proxy hop, so the real
    // client IP is the first entry in X-Forwarded-For — without this,
    // better-auth can't resolve it and rate-limits all clients as one bucket.
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"],
    },
  },
});

export type Session = typeof auth.$Infer.Session;
