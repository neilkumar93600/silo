import { Router } from "express";
import { authRequired } from "../middleware/auth-required.js";
import { uploadRateLimit } from "../middleware/rate-limit.js";
import { createUploadSchema, patchFileSchema, listFilesQuerySchema, shareFileSchema } from "../lib/validation.js";
import * as filesService from "../services/files.service.js";
import * as sharesService from "../services/shares.service.js";

export const filesRouter = Router();

filesRouter.use(authRequired);

filesRouter.get("/", async (req, res, next) => {
  try {
    const query = listFilesQuerySchema.parse(req.query);
    const result = await filesService.listFiles(req.userId, query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

filesRouter.post("/upload-url", uploadRateLimit, async (req, res, next) => {
  try {
    const body = createUploadSchema.parse(req.body);
    const result = await filesService.createPendingUpload({
      ownerId: req.userId,
      filename: body.filename,
      contentType: body.contentType,
      sizeBytes: body.sizeBytes,
      folderId: body.folderId,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

filesRouter.post("/:id/complete", async (req, res, next) => {
  try {
    const file = await filesService.completeUpload(req.params.id!, req.userId);
    res.json(file);
  } catch (err) {
    next(err);
  }
});

filesRouter.get("/:id/download", async (req, res, next) => {
  try {
    const url = await filesService.getDownloadUrl(req.params.id!, req.userId);
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

filesRouter.patch("/:id", async (req, res, next) => {
  try {
    const body = patchFileSchema.parse(req.body);
    const file = await filesService.updateFile(req.params.id!, req.userId, body);
    res.json(file);
  } catch (err) {
    next(err);
  }
});

filesRouter.delete("/:id", async (req, res, next) => {
  try {
    await filesService.trashFile(req.params.id!, req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

filesRouter.get("/:id/shares", async (req, res, next) => {
  try {
    res.json(await sharesService.listShares(req.params.id!, req.userId));
  } catch (err) {
    next(err);
  }
});

filesRouter.post("/:id/shares", async (req, res, next) => {
  try {
    const body = shareFileSchema.parse(req.body);
    res.status(201).json(await sharesService.addShare(req.params.id!, req.userId, body.email));
  } catch (err) {
    next(err);
  }
});

filesRouter.delete("/:id/shares/:userId", async (req, res, next) => {
  try {
    res.json(await sharesService.removeShare(req.params.id!, req.userId, req.params.userId!));
  } catch (err) {
    next(err);
  }
});
