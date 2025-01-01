import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logger } from "../utils/logger";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { AttendancesToSave, CreateAttendanceBody, InsertAttendance } from "../types";
import { findClassById, findUserById, insertAttendance } from "../services";
import { roles } from "../enums";
import { sendSuccessResponse } from "../utils/successResponse";




export const markAttendance = async (req: customRequestWithPayload<{}, any, CreateAttendanceBody>, res: Response, next: NextFunction) => {
    try {
        let { classId, students, studentId, attendanceDetails, ...commonAttendanceData } = req.body;

        if (classId) {
            const existingClass = await findClassById(classId);
            if (!existingClass) throw new NotFoundError('Class not found');
            if (existingClass.students.length <= 0) throw new BadRequestError('No students in this class');
            students = existingClass.students;
        }

        if (studentId) {
            students = [studentId];
        }

        if (!students && !attendanceDetails) throw new Error('Students or attendanceDetails must be provided');

        if (students) {
            await Promise.all(students.map(async (studentId) => {
                const existingStudent = await findUserById(studentId);
                if (!existingStudent || existingStudent.role !== roles.student) {
                    throw new NotFoundError(`Student not found: ${studentId}`);
                }
            }));
        }

        if (attendanceDetails && attendanceDetails.length <= 0) throw new BadRequestError('not Provided Attendance Details')

        const insertedAttendanceData = await insertAttendance(
            students ? { ...commonAttendanceData, students } : undefined,
            attendanceDetails
        );

        res.status(201).json(await sendSuccessResponse('Attendance marked successfully', insertedAttendanceData));

    } catch (error) {
        logger.error(error);
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            return next(error);
        }
        next(new InternalServerError('Internal Server Error'));
    }
};
