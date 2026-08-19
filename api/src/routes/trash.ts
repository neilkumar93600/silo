import { Router } from "express";
import { authRequired } from "../middleware/auth-required.js";
import * as trashService from "../services/trash.service.js";
import * as filesService from "../services/files.service.js";
import * as foldersService from "../services/folders.service.js";

export const trashRouter = Router();

trashRouter.use(authRequired);

trashRouter.get("/", async (req, res, next) => {
  try {
    res.json(await trashService.listTrash(req.userId));
  } catch (err) {
    next(err);
  }
});

trashRouter.post("/files/:id/restore", async (req, res, next) => {
  try {
    res.json(await filesService.restoreFile(req.params.id!, req.userId));
  } catch (err) {
    next(err);
  }
});

trashRouter.post("/folders/:id/restore", async (req, res, next) => {
  try {
    await foldersService.restoreFolder(req.params.id!, req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

trashRouter.delete("/files/:id", async (req, res, next) => {
  try {
    await filesService.permanentDeleteFile(req.params.id!, req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

trashRouter.delete("/folders/:id", async (req, res, next) => {
  try {
    await foldersService.permanentDeleteFolder(req.params.id!, req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

trashRouter.delete("/", async (req, res, next) => {
  try {
    await trashService.emptyTrash(req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
