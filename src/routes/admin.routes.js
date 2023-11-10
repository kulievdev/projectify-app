import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const adminRouter = Router();

adminRouter.post("/sign-up", adminController.signUp);
adminRouter.post("/login", adminController.login);
adminRouter.get("/activate", adminController.activate);
adminRouter.patch("/forgot-password", adminController.forgotPassword);
adminRouter.patch("/reset-password", adminController.resetPassword);
adminRouter.get("/me", adminMiddleware.authenticate, adminController.getMe);
adminRouter.delete(
    "/logout",
    adminMiddleware.authenticate,
    adminController.logout
);
adminRouter.patch(
    "/me/tasks",
    adminMiddleware.authenticate,
    adminController.createTask
);

adminRouter.get(
    "/me/tasks",
    adminMiddleware.authenticate,
    adminController.getTasks
);

adminRouter.get(
    "/me/tasks/:taskId",
    adminMiddleware.authenticate,
    adminController.getTask
);

adminRouter.patch(
    "/me/tasks/:taskId",
    adminMiddleware.authenticate,
    adminController.updateTask
);

adminRouter.patch(
    "/me/tasks/:taskId/delete",
    adminMiddleware.authenticate,
    adminController.deleteTask
);

export { adminRouter };
