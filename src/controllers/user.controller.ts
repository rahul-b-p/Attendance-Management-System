import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logger } from "../utils/logger";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../errors";
import { CreateUserBody, UpdateUserBody, UserToUse } from "../types";
import { roles } from "../enums";
import { DeleteUserById, findRoleById, findUserById, findUserByRole, insertUser, updateUserById, userExistsByEmail } from "../services";
import { ForbiddenError } from "../errors/forbidden.error";
import { sendSuccessResponse } from "../utils/successResponse";
import { isValidObjectId } from "../utils/objectIdValidator";




export const createUser = async (req: customRequestWithPayload<{ role: string }, any, CreateUserBody>, res: Response, next: NextFunction) => {
    try {
        const { role } = req.params;
        if (role !== roles.admin && role !== roles.teacher && role !== roles.student) return next(new BadRequestError('Bad request, requested to create user with inValid role'));

        const userId = req.payload?.id as string;
        const owner = await findUserById(userId) as UserToUse;
        if (role == roles.teacher || role == roles.admin) {
            if (owner.role !== roles.admin) return next(new ForbiddenError('Forbidden: Insufficient role privileges'))
        }

        const { email } = req.body;
        const userExists = await userExistsByEmail(email);
        if (userExists) return next(new ConflictError('already a user exists on given mail adress'));

        const userToInsert = { ...req.body, role };
        const response = await insertUser(userToInsert);

        res.status(201).json(await sendSuccessResponse('new User Created', response));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}

export const readUser = async (req: customRequestWithPayload<{ role: string }>, res: Response, next: NextFunction) => {
    try {
        const { role } = req.params;
        if (role !== roles.admin && role !== roles.teacher && role !== roles.student) return next(new BadRequestError('Bad request, requested to create user with inValid role'));

        const userId = req.payload?.id as string;
        const owner = await findUserById(userId) as UserToUse;
        if (role == roles.teacher || role == roles.admin) {
            if (owner.role !== roles.admin) return next(new ForbiddenError('Forbidden: Insufficient role privileges'));
        }

        const allUsersWithRole = await findUserByRole(role);
        res.status(200).json(await sendSuccessResponse(`Fetched all ${role}`, allUsersWithRole));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}

export const updateUser = async (req: customRequestWithPayload<{ id: string }, any, UpdateUserBody>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const isValidId = isValidObjectId(id);
        if (!isValidId) return next(new BadRequestError('Requested for an inValid Id!'));
        const existingRole = await findRoleById(id) as roles;

        const userId = req.payload?.id as string;
        const owner = await findUserById(userId) as UserToUse;
        if (existingRole == roles.teacher || existingRole == roles.admin) {
            if (owner.role !== roles.admin) return next(new ForbiddenError('Forbidden: Insufficient role privileges'));
        }
        const { role } = req.body;
        if (role && owner.role !== roles.admin) return next(new ForbiddenError('Forbidden: Insufficient role privileges'));

        const updatedUser = await updateUserById(id, req.body);
        if (!updatedUser) return next(new NotFoundError('User not found with given Id'));

        res.status(200).json(await sendSuccessResponse('Updated Succesfully', updatedUser))
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}

export const deleteUser = async (req: customRequestWithPayload<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const isValidId = isValidObjectId(id);
        if (!isValidId) return next(new BadRequestError('Requested for an inValid Id!'));
        const existingRole = await findRoleById(id) as roles;

        const userId = req.payload?.id as string;
        const owner = await findUserById(userId) as UserToUse;
        if (existingRole == roles.teacher || existingRole == roles.admin) {
            if (owner.role !== roles.admin) return next(new ForbiddenError('Forbidden: Insufficient role privileges'));
        }

        const isDeleted = await DeleteUserById(id);
        if (!isDeleted) return next(new NotFoundError('User not found with given Id'));

        res.status(200).json(await sendSuccessResponse('User Deleted Successfully'));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}