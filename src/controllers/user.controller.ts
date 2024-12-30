import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logger } from "../utils/logger";
import { BadRequestError, ConflictError, InternalServerError } from "../errors";
import { CreateUserBody, UserToUse } from "../types";
import { roles } from "../enums";
import { findUserById, findUserByRole, insertUser, userExistsByEmail } from "../services";
import { ForbiddenError } from "../errors/forbidden.error";
import { sendSuccessResponse } from "../utils/successResponse";




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
            if (owner.role !== roles.admin) return next(new ForbiddenError('Forbidden: Insufficient role privileges'))
        }

        const allUsersWithRole = await findUserByRole(role);
        res.status(200).json(await sendSuccessResponse(`Fetched all ${role}`,allUsersWithRole))
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}