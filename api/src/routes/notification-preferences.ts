import { Router } from "express";
import { authRequired } from "../middleware/auth-required.js";
import { patchNotificationPreferencesSchema } from "../lib/validation.js";
import * as preferencesService from "../services/notification-preferences.service.js";

export const notificationPreferencesRouter = Router();

notificationPreferencesRouter.use(authRequired);

notificationPreferencesRouter.get("/", async (req, res, next) => {
  try {
    res.json(await preferencesService.getPreferences(req.userId));
  } catch (err) {
    next(err);
  }
});

notificationPreferencesRouter.patch("/", async (req, res, next) => {
  try {
    const body = patchNotificationPreferencesSchema.parse(req.body);
    res.json(await preferencesService.updatePreferences(req.userId, body));
  } catch (err) {
    next(err);
  }
});
