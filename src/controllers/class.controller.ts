import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../errors";
import { logger } from "../utils/logger";
import { CreateClassBody } from "../types";
import { addStudentToClass, assignTeacherToClass, findAllClass, findClassById, findRoleById, findUserById, insertClass } from "../services";
import { sendSuccessResponse } from "../utils/successResponse";
import { roles } from "../enums";
import { isValidObjectId } from "../utils/objectIdValidator";
import { ForbiddenError } from "../errors/forbidden.error";



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
        res.status(200).json(await sendSuccessResponse('Fetched All Class Data', allClasses));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}

export const assignClass = async (req: customRequestWithPayload<{ classId: string }, any, { teacherId: string[] | string }>, res: Response, next: NextFunction) => {
    try {
        const { classId } = req.params;
        const isValidClassId = isValidObjectId(classId);
        if (!isValidClassId) return next(new BadRequestError('Requested with an Invalid Class Id'));

        const existingClass = await findClassById(classId);
        if (!existingClass) return next(new NotFoundError('Requested class not found!'));

        let { teacherId } = req.body;
        teacherId = Array.isArray(teacherId) ? teacherId : [teacherId];

        await Promise.all(
            teacherId.map(async (id) => {
                const userRoleFromTeacherId = await findRoleById(id);
                if (!userRoleFromTeacherId) throw new NotFoundError(`teacher with id: ${id} not found`);
                else if (userRoleFromTeacherId == roles.student) throw new ForbiddenError(`You have no permission to assign class for id: ${id}`);
            })
        )
        const existingTeacherIds = existingClass.teachers.map(teacher => teacher.toString());
        const repeatedTeachers = teacherId.filter(id => existingTeacherIds.includes(id));

        if (repeatedTeachers.length > 0) {
            return next(new ConflictError(`The following teacher(s) are already assigned to this class: ${repeatedTeachers.join(', ')}`));
        }

        const updatedClass = await assignTeacherToClass(classId, teacherId);
        res.status(200).json(await sendSuccessResponse('Updated Successfully', updatedClass));
    } catch (error) {
        if (error instanceof NotFoundError) return next(error);
        else if (error instanceof ForbiddenError) return next(error);

        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}

export const addToClass = async (req: customRequestWithPayload<{ classId: string }, any, { studentId: string[] | string }>, res: Response, next: NextFunction) => {
    try {
        const { classId } = req.params;
        const isValidClassId = isValidObjectId(classId);
        if (!isValidClassId) return next(new BadRequestError('Requested with an Invalid Class Id'));

        const existingClass = await findClassById(classId);
        if (!existingClass) return next(new NotFoundError('Requested class not found!'));

        let { studentId } = req.body;
        studentId = Array.isArray(studentId) ? studentId : [studentId];

        await Promise.all(
            studentId.map(async (id) => {
                const userRoleFromStudentId = await findRoleById(id);
                if (!userRoleFromStudentId) throw new NotFoundError(`student with id: ${id} not found`);
                else if (userRoleFromStudentId !== roles.student) throw new ForbiddenError(`You can't add a non-student of following id to a class, id: ${id}`);
            })
        )
        const existingStudentIds = existingClass.students.map(student => student.toString());
        const repeatedStudents = studentId.filter(id => existingStudentIds.includes(id));

        if (repeatedStudents.length > 0) {
            return next(new ConflictError(`The following student(s) are already assigned to this class: ${repeatedStudents.join(', ')}`));
        }

        const updatedClass = await addStudentToClass(classId, studentId);
        res.status(200).json(await sendSuccessResponse('Updated Successfully', updatedClass));
    } catch (error) {
        if (error instanceof NotFoundError) return next(error);
        else if (error instanceof ForbiddenError) return next(error);

        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}

