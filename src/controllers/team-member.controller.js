import { catchAsync } from "../errors/catchAsync.js";
import { CustomError } from "../errors/customError.js";
import { teamMemberService } from "../services/team-member.service.js";

class TeamMemberController {
    create = catchAsync(async (req, res) => {
        const { body, adminId } = req;

        const input = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            position: body.position
        };

        if (
            !input.firstName ||
            !input.lastName ||
            !input.email ||
            !input.position
        ) {
            throw new CustomError(
                "All fields are required: First name, Last Name, Email, Position",
                400
            );
        }

        await teamMemberService.create(adminId, input);

        res.status(201).send({
            message: `Team member with ${input.email} has been created`
        });
    });

    createPassword = catchAsync(async (req, res) => {
        const {
            query: { inviteToken },
            body: { password, passwordConfirm, email }
        } = req;

        if (!inviteToken) {
            throw new CustomError("Invite Token is missing", 400);
        }

        if (!password || !passwordConfirm || !email) {
            throw new CustomError(
                "All fields are required: Password and Password Confirmation, Email",
                400
            );
        }

        if (password !== passwordConfirm) {
            throw new CustomError(
                "Password and Password Confirmation must match",
                400
            );
        }

        await teamMemberService.createPassword(inviteToken, password, email);

        res.status(200).json({
            message: "You successfully created a password. Now, you can log in"
        });
    });

    forgotPassword = catchAsync(async (req, res) => {
        const {
            body: { email }
        } = req;

        await teamMemberService.forgotPassword(email);

        res.status(200).json({
            message:
                "We emailed you instructions on how to reset your password. Please, follow it!"
        });
    });

    resetPassword = catchAsync(async (req, res) => {
        const {
            body: { password, passwordConfirm },
            headers
        } = req;

        if (!password || !passwordConfirm) {
            throw new CustomError(
                "Both Password and Password Confirmation are required",
                400
            );
        }

        if (password !== passwordConfirm) {
            throw new CustomError(
                "Password and Password Confirmation does not match",
                400
            );
        }
        if (!headers.authorization) {
            throw new CustomError("Password Reset Token is missing", 400);
        }

        const [bearer, token] = headers.authorization.split(" ");

        if (bearer !== "Bearer" || !token) {
            throw new CustomError("Invalid Password Reset Token", 400);
        }

        await teamMemberService.resetPassword(token, password);
        res.status(200).json({
            message: "Password successfully updated"
        });
    });

    getAll = catchAsync(async (req, res) => {
        const { adminId } = req;
        const teamMembers = await teamMemberService.getAll(adminId);

        res.status(200).json({
            data: teamMembers
        });
    });

    deactivate = catchAsync(async (req, res) => {
        const { adminId, body } = req;
        await teamMemberService.changeStatus(
            adminId,
            body.teamMemberId,
            "INACTIVE"
        );

        res.status(204).send();
    });

    reactivate = catchAsync(async (req, res) => {
        const { adminId, body } = req;
        await teamMemberService.changeStatus(
            adminId,
            body.teamMemberId,
            "ACTIVE"
        );

        res.status(204).send();
    });

    login = catchAsync(async (req, res) => {
        const {
            body: { email, password }
        } = req;

        if (!email || !password) {
            throw new CustomError(
                "All fields required: email and password",
                400
            );
        }

        const { token, projectIds, me } = await teamMemberService.login(
            email,
            password
        );
        res.status(200).json({
            token,
            projectIds,
            me
        });
    });

    getMe = catchAsync(async (req, res) => {
        const { teamMember } = req;

        const me = await teamMemberService.getMe(teamMember);

        res.status(200).json({
            data: me
        });
    });
}

export const teamMemberController = new TeamMemberController();
