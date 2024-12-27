import { NextFunction, Response } from "express";
import { roles } from "../enums";
import { customRequestWithPayload } from "../interfaces";
import { AuthenticationError, InternalServerError } from "../errors";
import { findRoleById } from "../services";
import { ForbiddenError } from "../errors/forbidden.error";
import { logger } from "../utils/logger";



export const validateRole = (...allowedRole: roles[]) => {
    return async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
        try {
            const id = req.payload?.id;
            if (!id) throw new Error('The user ID was not added to the payload by the authentication middleware.');

            const role = await findRoleById(id);
            if (!role) return next(new AuthenticationError('Invalid or expired access token. User not found.'));

            if (!allowedRole.includes(role)) return next(new ForbiddenError('Forbidden: Insufficient role privileges'));

            next();
        } catch (error) {
            logger.error(error);
            next(new InternalServerError('Something went wrong'));
        }
    }
}
