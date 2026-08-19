import { Router } from "express";
import { authRequired } from "../middleware/auth-required.js";
import * as sharesService from "../services/shares.service.js";

export const sharedRouter = Router();

sharedRouter.use(authRequired);

sharedRouter.get("/", async (req, res, next) => {
  try {
    res.json(await sharesService.listSharedWithMe(req.userId));
  } catch (err) {
    next(err);
  }
});
