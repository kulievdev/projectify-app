import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { teamMemberController } from "../controllers/team-member.controller.js";

const teamMemberRouter = new Router();

teamMemberRouter.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    teamMemberController.create
);

teamMemberRouter.patch("/create-password", teamMemberController.createPassword);
teamMemberRouter.patch("/forgot-password", teamMemberController.forgotPassword);
teamMemberRouter.patch("/reset-password", teamMemberController.resetPassword);

teamMemberRouter.get(
    "/",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    teamMemberController.getAll
);

teamMemberRouter.patch(
    "/:id/deactivate",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    teamMemberController.deactivate
);

teamMemberRouter.patch(
    "/:id/reactivate",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    teamMemberController.reactivate
);
teamMemberRouter.delete(
    "/:id/delete",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    teamMemberController.delete
);
teamMemberRouter.patch(
    "/:id/update",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    teamMemberController.update
);

teamMemberRouter.post("/login", teamMemberController.login);
teamMemberRouter.get(
    "/me",
    authMiddleware.authenticate,
    authMiddleware.isTeamMember,
    teamMemberController.getMe
);

teamMemberRouter.patch(
    "/me/tasks",
    authMiddleware.authenticate,
    authMiddleware.isTeamMember,
    teamMemberController.createTask
);

teamMemberRouter.get(
    "/me/tasks",
    authMiddleware.authenticate,
    authMiddleware.isTeamMember,
    teamMemberController.getTasks
);

teamMemberRouter.get(
    "/me/tasks/:taskId",
    authMiddleware.authenticate,
    authMiddleware.isTeamMember,
    teamMemberController.getTask
);

teamMemberRouter.patch(
    "/me/tasks/:taskId",
    authMiddleware.authenticate,
    authMiddleware.isTeamMember,
    teamMemberController.updateTask
);

teamMemberRouter.delete(
    "/me/tasks/:taskId",
    authMiddleware.authenticate,
    authMiddleware.isTeamMember,
    teamMemberController.deleteTask
);

export { teamMemberRouter };
