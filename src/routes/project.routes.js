import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middleware.js";
import { projectController } from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.post("/", userMiddleware.authenticate, projectController.create);

export { projectRouter };
