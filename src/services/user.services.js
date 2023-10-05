import { prisma } from "../prisma/index.js";
import { hashFunction, generateSalt } from "../utils/hash.js";

class UserService {
    signUp = async (input) => {
        try {
            const salt = generateSalt();
            const hashedPassword = hashFunction(input.password + salt);
            await prisma.user.create({
                data: { ...input, password: `${salt}.${hashedPassword}` }
            });
        } catch (error) {
            throw new Error(error);
        }
    };
    login = async (input) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email: input.email
                }
            });

            if (!user) {
                throw new Error("Invalid Credentials");
            }

            const [salt, userHashedPassword] = user.password.split(".");
            const hashedPassword = hashFunction(input.password + salt);

            if (userHashedPassword !== hashedPassword) {
                throw new Error("Invalid Credentials");
            }
        } catch (error) {
            throw error;
        }
    };
}

export const userService = new UserService();
