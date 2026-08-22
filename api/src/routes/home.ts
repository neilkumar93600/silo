import { Router } from "express";
import { authRequired } from "../middleware/auth-required.js";
import * as homeService from "../services/home.service.js";

export const homeRouter = Router();

homeRouter.use(authRequired);

homeRouter.get("/", async (req, res, next) => {
  try {
    res.json(await homeService.getHomeFeed(req.userId));
  } catch (err) {
    next(err);
  }
});
