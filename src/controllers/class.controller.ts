import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { InternalServerError, NotFoundError } from "../errors";
import { logger } from "../utils/logger";
import { CreateClassBody } from "../types";
import { findAllClass, findUserById, insertClass } from "../services";
import { sendSuccessResponse } from "../utils/successResponse";
import { roles } from "../enums";



export const createClass = async (req: customRequestWithPayload<{}, any, CreateClassBody>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id as string;
        let { students, teachers } = req.body;

        if (students) {
            students = Array.isArray(students) ? students : [students];

            await Promise.all(
                students.map(async (item) => {
                    const existingStudent = await findUserById(item);
                    if (!existingStudent || existingStudent.role !== roles.student) {
                        throw new NotFoundError(`No student found with the given ID: "${item}"`);
                    }
                })
            );
        }

        if (teachers) {
            teachers = Array.isArray(teachers) ? teachers : [teachers];

            await Promise.all(
                teachers.map(async (item) => {
                    const existingTeacher = await findUserById(item);
                    if (!existingTeacher || existingTeacher.role === roles.student) {
                        throw new NotFoundError(`No teacher or admin found with the given ID: "${item}"`);
                    }
                })
            );
        }

        const newClass = await insertClass(userId, req.body);
        res.status(201).json(await sendSuccessResponse('New Class created with given data', newClass));
    } catch (error) {
        if (error instanceof NotFoundError) {
            return next(error);
        }
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
};

export const readAllClasses = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const allClasses = await findAllClass();
        res.status(200).json(await sendSuccessResponse('Fetched All Class Data', allClasses))
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}

