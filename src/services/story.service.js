import { prisma } from "../prisma/index.js";
import { projectService } from "./project.service.js";
import { CustomError } from "../errors/customError.js";

class StoryService {
    create = async (input, adminId) => {
        await projectService.isProjectBelongsToAdmin(input.projectId, adminId);

        const story = await prisma.story.create({
            data: {
                ...input,
                adminId: adminId
            }
        });

        return story;
    };

    getOne = async (id, adminId, teamMember) => {
        const story = await prisma.story.findUnique({
            where: {
                id: id
            }
        });

        if (adminId) {
            await projectService.isProjectBelongsToAdmin(
                story.projectId,
                adminId
            );
        }

        if (teamMember) {
            await this.isStoryBelongsToTeamMember(id, teamMember);
        }

        return story;
    };

    getAll = async (adminId, teamMember) => {
        if (adminId) {
            const stories = await prisma.story.findMany({
                where: {
                    adminId: adminId
                }
            });

            return stories;
        }

        if (teamMember) {
            const stories = await prisma.story.findMany({
                where: {
                    assigneeId: teamMember.id
                }
            });
            return stories;
        }
    };

    update = async (id, adminId, update) => {
        await prisma.story.update({
            where: {
                id: id,
                adminId: adminId
            },
            data: {
                ...update
            }
        });
    };

    deleteOne = async (id, adminId) => {
        await prisma.story.delete({
            where: {
                id: id,
                adminId: adminId
            }
        });
    };

    isStoryBelongsToTeamMember = async (id, teamMember) => {
        const story = await prisma.story.findUnique({
            where: {
                id
            }
        });

        if (!story) {
            throw new CustomError("Story does not exist", 404);
        }
        if (teamMember.id !== story.assigneeId) {
            throw new CustomError("This story does not belong to you", 400);
        }
    };
}

export const storyService = new StoryService();
