import { catchAsync } from "../errors/catchAsync.js";
import { CustomError } from "../errors/customError.js";
import { teamMemberService } from "../services/team-member.service.js";

class TeamMemberController {
    create = catchAsync(async (req, res) => {
        const { body, adminId } = req;

        const input = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email
        };

        if (!input.firstName || !input.lastName || !input.email) {
            throw new CustomError(
                "All fields are required: first name, last name and email",
                400
            );
        }

        await teamMemberService.create(adminId, input);

        res.status(201).send();
    });

    createPassword = catchAsync(async (req, res) => {
        const {
            query: { inviteToken },
            body: { password, passwordConfirm, email }
        } = req;

        if (!inviteToken) throw new CustomError("Invite Token is missing", 400);

        if (!password || !passwordConfirm || !email) {
            throw new CustomError(
                "All fields are required: password, password confirmation and email",
                400
            );
        }

        if (password !== password) {
            throw new CustomError(
                "Password and Password confirmation must match",
                400
            );
        }

        await teamMemberService.createPassword(inviteToken, password, email);

        res.status(200).json({
            message: "You successfully created a password. Now you can login."
        });
    });
}

export const teamMemberController = new TeamMemberController();
