import express from "express";

import { userRouter } from "./routes/user.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { teamMemberRouter } from "./routes/team-member.routes.js";

import dotenv from "dotenv";
import { GlobalError } from "./middlewares/global-error.middleware.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/users", userRouter);
app.use("/projects", projectRouter);
app.use("/team-members", teamMemberRouter);
app.use(GlobalError.handle);

app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});
