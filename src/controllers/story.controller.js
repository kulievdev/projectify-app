import { catchAsync } from "../errors/catchAsync.js";
import { CustomError } from "../errors/customError.js";
import { prisma } from "../prisma/index.js";
import { storyService } from "../services/story.service.js";

class StoryController {
    create = catchAsync(async (req, res) => {
        const {
            body: { title, description, point, due, assigneeId, projectId },
            adminId
        } = req;

        if (!title || !projectId) {
            throw new CustomError("title and projectId are required", 400);
        }
        const input = {
            title,
            description,
            point,
            due,
            assigneeId,
            projectId
        };

        const story = await storyService.create(input, adminId);
        res.status(200).json({
            data: story
        });
    });

    getOne = catchAsync(async (req, res) => {
        const { params, adminId, teamMember } = req;

        const story = await storyService.getOne(params.id, adminId, teamMember);

        res.status(200).json({
            data: story
        });
    });

    getAll = catchAsync(async (req, res) => {
        const { adminId, teamMember } = req;

        const stories = await storyService.getAll(adminId, teamMember);

        res.status(200).json({
            data: stories
        });
    });

    update = catchAsync(async (req, res) => {
        const { body, params, adminId } = req;
        const update = {};

        if (body.title) {
            update.title = body.title;
        }
        if (body.description) {
            update.description = body.description;
        }
        if (body.point) {
            update.point = body.point;
        }
        if (body.due) {
            update.due = body.due;
        }
        if (body.projectId) {
            update.projectId = body.projectId;
        }
        if (body.assigneeId) {
            update.assigneeId = body.assigneeId;
        }

        if (
            !update.title &&
            !update.description &&
            !update.point &&
            !update.due &&
            !update.projectId &&
            !update.assigneeId
        ) {
            throw new CustomError("No update data provided", 400);
        }

        await storyService.update(params.id, adminId, update);
        res.status(204).send();
    });

    deleteOne = catchAsync(async (req, res) => {
        const { params, adminId } = req;

        await storyService.deleteOne(params.id, adminId);

        res.status(204).send();
    });
}

export const storyController = new StoryController();
