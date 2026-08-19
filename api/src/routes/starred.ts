import { Router } from "express";
import { authRequired } from "../middleware/auth-required.js";
import * as starredService from "../services/starred.service.js";

export const starredRouter = Router();

starredRouter.use(authRequired);

starredRouter.get("/", async (req, res, next) => {
  try {
    res.json(await starredService.listStarred(req.userId));
  } catch (err) {
    next(err);
  }
});
