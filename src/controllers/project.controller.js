import { projectService } from "../services/project.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { CustomError } from "../errors/customError.js";

class ProjectController {
    create = catchAsync(async (req, res) => {
        const { body, userId } = req;

        const input = {
            name: body.name,
            description: body.description
        };

        if (!input.name || !input.description) {
            throw new CustomError("Name and Description are required", 400);
        }

        const project = await projectService.create(input, userId);

        res.status(201).json({
            data: project
        });
    });

    getOne = catchAsync(async (req, res) => {
        const { userId, params } = req;

        const project = await projectService.getOne(params.id, userId);

        res.status(200).json({
            data: project
        });
    });
}

export const projectController = new ProjectController();
