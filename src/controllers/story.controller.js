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

    getOne = (req, res) => {
        const { story } = req;
        res.status(200).json({
            data: story
        });
    };
}

export const storyController = new StoryController();
