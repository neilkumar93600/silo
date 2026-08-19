import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth.js";
import { Errors } from "../lib/errors.js";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export async function authRequired(req: Request, _res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

  if (!session) {
    next(Errors.unauthorized());
    return;
  }

  req.userId = session.user.id;
  next();
}
