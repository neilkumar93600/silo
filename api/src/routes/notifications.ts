import { Router } from "express";
import { authRequired } from "../middleware/auth-required.js";
import * as notificationsService from "../services/notifications.service.js";

export const notificationsRouter = Router();

notificationsRouter.use(authRequired);

notificationsRouter.get("/", async (req, res, next) => {
  try {
    res.json(await notificationsService.listNotifications(req.userId));
  } catch (err) {
    next(err);
  }
});

notificationsRouter.post("/read-all", async (req, res, next) => {
  try {
    await notificationsService.markAllRead(req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

notificationsRouter.post("/:id/read", async (req, res, next) => {
  try {
    res.json(await notificationsService.markRead(req.params.id!, req.userId));
  } catch (err) {
    next(err);
  }
});

notificationsRouter.delete("/:id", async (req, res, next) => {
  try {
    await notificationsService.remove(req.params.id!, req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
