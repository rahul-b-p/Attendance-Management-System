import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { logger } from "../utils/logger";
import { CreateClassBody } from "../types";
import { isValidObjectId } from "../utils/objectIdValidator";
import { findUserById, findUserByRole, insertClass, userExistsByEmail, userExistsById } from "../services";
import { sendSuccessResponse } from "../utils/successResponse";
import { roles } from "../enums";



export const createClass = async (req: customRequestWithPayload<{}, any, CreateClassBody>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id as string;
        const { students, teachers } = req.body

        if (students) (
            students.map(async (item) => {
                const isValidId = isValidObjectId(item);
                if (!isValidId) return next(new BadRequestError(`"${item}" is an Invalid Id!`));

                const existingStudent = await findUserById(item);
                if (!existingStudent || existingStudent.role !== roles.student) return next(new NotFoundError(`not found any student with given id: "${item}"`));
            })
        )

        if (teachers) (
            teachers.map(async (item) => {
                const isValidId = isValidObjectId(item);
                if (!isValidId) return next(new BadRequestError(`"${item}" is an Invalid Id!`));

                const existngTeacher = await findUserById(item);
                if (!existngTeacher || existngTeacher.role == roles.student) return next(new NotFoundError(`not found any teacher with given id: "${item}"`));
            })
        )

        const newClass = await insertClass(userId, req.body);
        res.status(201).json(await sendSuccessResponse('New Class created with given data', newClass));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}