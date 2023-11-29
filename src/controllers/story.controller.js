import { catchAsync } from "../errors/catchAsync.js";
import { CustomError } from "../errors/customError.js";
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
        const { params } = req;

        const story = await storyService.getOne(params.storyId);

        res.status(200).json({
            data: story
        });
    });

    getAll = catchAsync(async (req, res) => {
        const { params, adminId } = req;

        const stories = await storyService.getAll(params.projectId, adminId);
        res.status(200).json({
            data: stories
        });
    });

    update = catchAsync(async (req, res) => {
        const { body, params } = req;
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

        await storyService.update(params.storyId, update);

        res.status(204).send();
    });

    deleteOne = catchAsync(async (req, res) => {
        const { params } = req;

        await storyService.deleteOne(params.storyId);

        res.status(204).send();
    });

    createSubTask = catchAsync(async (req, res) => {
        const {
            params: { storyId },
            body: { title, description, due }
        } = req;

        const input = {
            title: title,
            description: description,
            due: due
        };

        if (!input.title || !input.description || !input.due) {
            throw new CustomError(
                "All fields are required: title, description and due date",
                404
            );
        }

        const subtask = await storyService.createSubTask(storyId, input);

        res.status(200).json({
            data: subtask
        });
    });

    getSubTask = catchAsync(async (req, res) => {
        const {
            story,
            params: { subTaskId }
        } = req;

        const subTask = await storyService.getSubTask(story, subTaskId);

        res.status(200).json({
            data: subTask
        });
    });

    getAllSubTasks = catchAsync(async (req, res) => {
        const { story } = req;

        const subTasks = await storyService.getAllSubTasks(story);

        res.status(200).json({
            data: subTasks
        });
    });

    updateSubTask = catchAsync(async (req, res) => {
        const {
            story,
            body: { title, description, due },
            params: { subTaskId }
        } = req;

        const input = {};

        if (title) {
            input.title = title;
        }
        if (description) {
            input.description = description;
        }
        if (due) {
            input.due = due;
        }

        if (!Object.keys(input).length) {
            throw new CustomError("Update data is required, 400");
        }

        await storyService.updateSubTask(story, subTaskId, input);

        res.status(204).send();
    });

    deleteSubTask = catchAsync(async (req, res) => {
        const {
            story,
            params: { subTaskId }
        } = req;

        await storyService.deleteSubTask(story, subTaskId);

        res.status(204).send();
    });
}

export const storyController = new StoryController();
