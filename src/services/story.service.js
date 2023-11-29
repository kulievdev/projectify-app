import { prisma } from "../prisma/index.js";
import { projectService } from "./project.service.js";
import { v4 as uuid } from "uuid";
import { CustomError } from "../errors/customError.js";

class StoryService {
    create = async (input) => {
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

        return story;
    };

    getAll = async (projectId, adminId) => {
        projectService.isProjectBelongsToAdmin(projectId, adminId);

        const stories = await prisma.story.findMany({
            where: {
                projectId: projectId
            }
        });

        return stories;
    };

    update = async (id, update) => {
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
        await prisma.story.delete({
            where: {
                id: id
            }
        });
    };

    createSubTask = async (storyId, input) => {
        const id = uuid();

        const subTask = {
            ...input,
            id: id
        };

        await prisma.story.update({
            where: {
                id: storyId
            },
            data: {
                subTasks: {
                    push: subTask
                }
            }
        });

        return subTask;
    };

    getSubTask = async (story, subTaskId) => {
        const subTask = story.subTasks.find((subTask) => {
            return subTask.id === subTaskId;
        });

        return subTask;
    };

    getAllSubTasks = async (story) => {
        return story.subTasks;
    };

    updateSubTask = async (story, subTaskId, input) => {
        const subTasks = story.subTasks;

        const tasksNotToUpdate = [];
        let taskToUpdate = null;

        subTasks.forEach((subTask) => {
            if (subTask.id === subTaskId) {
                taskToUpdate = subTask;
            } else {
                tasksNotToUpdate.push(subTask);
            }
        });

        if (!taskToUpdate) {
            throw new CustomError("SubTask does not exist", 404);
        }

        const updatedTask = {
            ...taskToUpdate,
            ...input
        };

        await prisma.story.update({
            where: {
                id: story.id
            },
            data: {
                subTasks: [...tasksNotToUpdate, updatedTask]
            }
        });
    };

    deleteSubTask = async (story, subTaskId) => {
        const subTasksToKeep = story.subTasks.filter(
            (subTask) => subTask.id !== subTaskId
        );

        if (subTasksToKeep.length === story.subTasks.length) {
            throw new CustomError("SubTask does not exist", 404);
        }

        await prisma.story.update({
            where: {
                id: story.id
            },
            data: {
                subTasks: subTasksToKeep
            }
        });
    };
}

export const storyService = new StoryService();
