import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middleware.js";
import { projectController } from "../controllers/project.controller.js";

const projectRouter = Router();

export { projectRouter };
