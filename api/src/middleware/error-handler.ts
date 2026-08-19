import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/errors.js";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: { code: "validation_error", message: "Invalid request", issues: err.flatten() },
    });
    return;
  }

  req.log?.error({ err }, "unhandled error");
  res.status(500).json({ error: { code: "internal_error", message: "Something went wrong" } });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { code: "not_found", message: "Route not found" } });
}
