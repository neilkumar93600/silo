import { Router } from "express";
import { authRequired } from "../middleware/auth-required.js";
import { createFolderSchema, patchFolderSchema, listFoldersQuerySchema } from "../lib/validation.js";
import * as foldersService from "../services/folders.service.js";

export const foldersRouter = Router();

foldersRouter.use(authRequired);

foldersRouter.get("/", async (req, res, next) => {
  try {
    const query = listFoldersQuerySchema.parse(req.query);
    const result = await foldersService.listFolderContents(req.userId, query.parentId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

foldersRouter.post("/", async (req, res, next) => {
  try {
    const body = createFolderSchema.parse(req.body);
    const folder = await foldersService.createFolder(req.userId, body.name, body.parentId);
    res.status(201).json(folder);
  } catch (err) {
    next(err);
  }
});

foldersRouter.patch("/:id", async (req, res, next) => {
  try {
    const body = patchFolderSchema.parse(req.body);
    const folder = await foldersService.updateFolder(req.params.id!, req.userId, body);
    res.json(folder);
  } catch (err) {
    next(err);
  }
});

foldersRouter.delete("/:id", async (req, res, next) => {
  try {
    await foldersService.trashFolder(req.params.id!, req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
