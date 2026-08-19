import { Router } from "express";
import * as filesService from "../services/files.service.js";

export const shareRouter = Router();

// Public, unauthenticated: anyone with the slug can fetch metadata + a
// short-lived download URL for a file its owner marked public.
shareRouter.get("/:slug", async (req, res, next) => {
  try {
    const { url, file } = await filesService.getPublicDownloadUrl(req.params.slug!);
    res.json({
      url,
      file: {
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
        createdAt: file.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});
