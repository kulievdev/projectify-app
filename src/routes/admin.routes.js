import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

adminRouter.post("/sign-up", adminController.signUp);
adminRouter.post("/login", adminController.login);
adminRouter.get("/activate-account", adminController.activate);
adminRouter.patch("/forgot-password", adminController.forgotPassword);
adminRouter.patch("/reset-password", adminController.resetPassword);
adminRouter.get(
    "/me",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    adminController.getMe
);

adminRouter.patch(
    "/me",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    adminController.updateMe
);

adminRouter.patch(
    "/me/tasks",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    adminController.createTask
);

adminRouter.get(
    "/me/tasks",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    adminController.getTasks
);

adminRouter.get(
    "/me/tasks/:taskId",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    adminController.getTask
);

adminRouter.patch(
    "/me/tasks/:taskId",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    adminController.updateTask
);

adminRouter.delete(
    "/me/tasks/:taskId",
    authMiddleware.authenticate,
    authMiddleware.isAdmin,
    adminController.deleteTask
);

export { adminRouter };
