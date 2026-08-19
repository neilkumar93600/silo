import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

export const assistantRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

// Sharing has no cost-based limiter like uploads, but unlimited share/unshare
// cycles against a known email each spawn a notification — bound the rate so
// that can't be used to spam another user's notification feed.
export const shareRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
