import { prisma } from "../prisma/index.js";
import { hasher } from "../utils/hash.js";
import { mailer } from "../utils/mailer.js";

class UserService {
    signUp = async (input) => {
        try {
            const hashedPassword = await hasher.hash(input.password);
            await prisma.user.create({
                data: { ...input, password: hashedPassword }
            });

            await mailer.sendActivationMail(input.email, "hdaskjdhaskjd");
        } catch (error) {
            console.log(error);
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

            if (!user) throw new Error("Invalid Credentials");
            if (user.status === "INACTIVE") {
                throw new Error(
                    "Email address is not verified. Verify your email."
                );
            }

            const isPasswordMatches = await hasher.compare(
                input.password,
                user.password
            );
            if (!isPasswordMatches) {
                throw new Error("Invalid Credentials");
            }
        } catch (error) {
            throw error;
        }
    };
}

export const userService = new UserService();
