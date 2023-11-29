import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { storyController } from "../controllers/story.controller.js";

const storyRouter = Router();

storyRouter.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    authMiddleware.verifyCreateStoryPermissions,
    storyController.create
);

storyRouter.get(
    "/:storyId",
    authMiddleware.authenticate,
    authMiddleware.verifyReadUpdateDeleteStoryAndSubtaskPermissions,
    storyController.getOne
);

storyRouter.get(
    "/projectStories/:projectId",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    storyController.getAll
);

storyRouter.patch(
    "/:storyId",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    authMiddleware.verifyReadUpdateDeleteStoryAndSubtaskPermissions,
    storyController.update
);

storyRouter.delete(
    "/:storyId",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    authMiddleware.verifyReadUpdateDeleteStoryAndSubtaskPermissions,
    storyController.deleteOne
);

storyRouter.patch(
    "/:storyId/subTasks",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    authMiddleware.verifyReadUpdateDeleteStoryAndSubtaskPermissions,
    storyController.createSubTask
);

storyRouter.get(
    "/:storyId/subTasks/:subTaskId",
    authMiddleware.authenticate,
    authMiddleware.verifyReadUpdateDeleteStoryAndSubtaskPermissions,
    storyController.getSubTask
);

storyRouter.get(
    "/:storyId/subTasks",
    authMiddleware.authenticate,
    authMiddleware.verifyReadUpdateDeleteStoryAndSubtaskPermissions,
    storyController.getAllSubTasks
);

storyRouter.patch(
    "/:storyId/subTasks/:subTaskId",
    authMiddleware.authenticate,
    authMiddleware.verifyReadUpdateDeleteStoryAndSubtaskPermissions,
    storyController.updateSubTask
);

storyRouter.delete(
    "/:storyId/subTasks/:subTaskId",
    authMiddleware.authenticate,
    authMiddleware.verifyReadUpdateDeleteStoryAndSubtaskPermissions,
    storyController.deleteSubTask
);

export { storyRouter };
