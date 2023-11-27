import { prisma } from "../prisma/index.js";
import { projectService } from "./project.service.js";
import { CustomError } from "../errors/customError.js";

class StoryService {
    create = async (input, adminId) => {
        await projectService.isProjectBelongsToAdmin(input.projectId, adminId);
        const story = await prisma.story.create({
            data: input
        });

        return story;
    };

    getOne = async (id) => {
        const story = await prisma.story.findUnique({
            where: {
                id: id
            }
        });
        if (!story) {
            throw new CustomError("Story does not exist", 404);
        }

        return story;
    };

    getAll = async (projectId, adminId) => {
        await projectService.isProjectBelongsToAdmin(projectId, adminId);

        const stories = await prisma.story.findMany({
            where: {
                projectId: projectId
            }
        });

        return stories;
    };

    update = async (id, update) => {
        const story = await prisma.story.findUnique({
            where: {
                id: id
            }
        });

        if (!story) {
            throw new CustomError("Story does not exist", 404);
        }

        await prisma.story.update({
            where: {
                id: id
            },
            data: {
                ...update
            }
        });
    };

    deleteOne = async (id) => {
        const story = await prisma.story.findUnique({
            where: {
                id: id
            }
        });

        if (!story) {
            throw new CustomError("Story does not exist", 404);
        }

        await prisma.story.delete({
            where: {
                id: id
            }
        });
    };
}

export const storyService = new StoryService();
