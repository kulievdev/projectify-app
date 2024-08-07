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
            position: body.position,
            joinDate: body.joinDate
        };

        if (
            !input.firstName ||
            !input.lastName ||
            !input.email ||
            !input.position ||
            !input.joinDate
        ) {
            throw new CustomError(
                "All fields are required: First name, Last Name, Email, Position",
                400
            );
        }

        const teamMember = await teamMemberService.create(adminId, input);

        res.status(201).send({
            data: teamMember
        });
    });

    createPassword = catchAsync(async (req, res) => {
        const {
            headers,
            body: { password, passwordConfirm, email }
        } = req;

        if (!headers.authorization) {
            throw new CustomError("You are not logged in. Please, log in", 401);
        }
        const [prefix, token] = headers.authorization.split(" ");

        if (!prefix || !token) {
            throw new CustomError("Not Valid Token", 400);
        }

        if (!token) {
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

        await teamMemberService.createPassword(token, password, email);

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
        const { adminId, params } = req;
        await teamMemberService.changeStatus(adminId, params.id, "DEACTIVATED");

        res.status(204).send();
    });

    delete = catchAsync(async (req, res) => {
        const { adminId, params } = req;
        await teamMemberService.delete(adminId, params.id);

        res.status(204).send();
    });

    reactivate = catchAsync(async (req, res) => {
        const { adminId, params } = req;
        await teamMemberService.changeStatus(adminId, params.id, "ACTIVE");

        res.status(204).send();
    });

    update = catchAsync(async (req, res) => {
        const { adminId, params, body } = req;

        const input = {};

        if (body.firstName) {
            input.firstName = body.firstName;
        }
        if (body.lastName) {
            input.lastName = body.lastName;
        }
        if (body.email) {
            input.email = body.email;
        }
        if (body.position) {
            input.position = body.position;
        }
        if (body.joinDate) {
            input.joinDate = body.joinDate;
        }

        if (!Object.keys(input).length) {
            throw new CustomError("Update data is required, 400");
        }

        await teamMemberService.update(adminId, params.id, input);
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

        // const { token, projectIds, me } = await teamMemberService.login(
        //     email,
        //     password
        // );
        // res.status(200).json({
        //     token,
        //     projectIds,
        //     me
        // });

        const jwt = await teamMemberService.login(email, password);
        res.status(200).json({
            token: jwt
        });
    });

    getMe = catchAsync(async (req, res) => {
        const {
            teamMember: { id }
        } = req;

        const me = await teamMemberService.getMe(id);

        res.status(200).json({
            data: me
        });
    });

    updateMe = catchAsync(async (req, res) => {
        const {
            teamMember: { id },
            body
        } = req;

        const input = {};

        if (body.oldPassword) {
            input.oldPassword = body.oldPassword;
        }
        if (body.newPassword) {
            input.newPassword = body.newPassword;
        }
        if (body.newPasswordConfirm) {
            input.newPasswordConfirm = body.newPasswordConfirm;
        }

        await teamMemberService.updateMe(id, input);

        res.status(204).send();
    });

    createTask = catchAsync(async (req, res) => {
        const {
            teamMember: { id },
            body
        } = req;

        const input = {
            title: body.title,
            description: body.description,
            due: body.due
        };

        if (!input.title || !input.due) {
            throw new CustomError("Both Title and Due Date are required", 404);
        }

        const data = await teamMemberService.createTask(id, input);

        res.status(201).json({
            data
        });
    });

    getTasks = catchAsync(async (req, res) => {
        const {
            teamMember: { id }
        } = req;

        if (!id) {
            throw new CustomError(
                "Forbidden: You are not authorized to perform this action",
                403
            );
        }

        const tasks = await teamMemberService.getTasks(id);

        res.status(200).json({
            data: tasks
        });
    });

    getTask = catchAsync(async (req, res) => {
        const {
            teamMember: { id },
            params
        } = req;

        const task = await teamMemberService.getTask(id, params.taskId);

        res.status(200).json({
            data: task
        });
    });

    deleteTask = catchAsync(async (req, res) => {
        const {
            teamMember: { id },
            params
        } = req;

        await teamMemberService.deleteTask(id, params.taskId);
        res.status(204).send();
    });

    updateTask = catchAsync(async (req, res) => {
        const {
            teamMember: { id },
            params,
            body
        } = req;

        const input = {};
        if (body.status) {
            input.status = body.status;
        }
        if (body.title) {
            input.title = body.title;
        }
        if (body.description) {
            input.description = body.description;
        }
        if (body.due) {
            input.due = body.due;
        }

        if (!Object.keys(input).length) {
            throw new CustomError("Update data is required, 400");
        }

        await teamMemberService.updateTask(id, params.taskId, input);
        res.status(204).send();
    });
}

export const teamMemberController = new TeamMemberController();
