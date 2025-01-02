import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logger } from "../utils/logger";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { AttendanceQuery, CreateAttendanceBody } from "../types";
import { findClassById, findFilteredAttendance, findRoleById, findUserById, getStudentsInAssignedClasses, insertAttendance, isStudentInAssignedClass } from "../services";
import { roles } from "../enums";
import { sendSuccessResponse } from "../utils/successResponse";
import { ForbiddenError } from "../errors/forbidden.error";




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

export const viewAttendance = async (req: customRequestWithPayload<{}, any, any, AttendanceQuery>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id as string;
        const userRole = await findRoleById(userId) as roles;
        const { studentId, date, status } = req.query;

        let students: string[] = [];

        if (userRole === roles.student) {
            students = [userId];
        }
        else if (userRole === roles.teacher) {
            if (studentId) {
                const isPermittedTeacher = await isStudentInAssignedClass(userId, studentId);
                if (!isPermittedTeacher) throw new ForbiddenError('Not permitted to access this student data');
                students = [studentId];
            } else {
                students = await getStudentsInAssignedClasses(userId);
                if (students.length === 0) throw new NotFoundError('No students in assigned classes');
            }
        }
        else if (studentId) {
            students = [studentId];
        }

        const query: Record<string, any> = { students };

        if (date) query.date = date;
        if (status) query.status = status;

        const attendanceData = await findFilteredAttendance(query);
        res.status(200).json(await sendSuccessResponse('Fetched attendance data', attendanceData));
    } catch (error) {
        if (error instanceof ForbiddenError || error instanceof NotFoundError) return next(error);
        logger.error(error);
        next(new InternalServerError('Internal Server Error'));
    }
};
