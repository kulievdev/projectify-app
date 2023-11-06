import { prisma } from "../utils/prismaClient.js";

class ProjectService {
    create = async (input, userId) => {
        const project = await prisma.project.create({
            data: {
                ...input,
                userId: userId
            }
        });

        return project;
    };
}

export const projectService = new ProjectService();
