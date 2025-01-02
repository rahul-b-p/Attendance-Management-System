import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logger } from "../utils/logger";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { AttendanceQuery, AttendanceSearchQuery, AttendanceSummaryQuery, CreateAttendanceBody, StanderdAttendance } from "../types";
import { findAttendanceDataById, findAttendanceSummary, findClassById, findFilteredAttendance, findRoleById, findUserById, getStudentsInAssignedClasses, insertAttendance, isStudentInAssignedClass, updateAttendanceById } from "../services";
import { roles } from "../enums";
import { sendSuccessResponse } from "../utils/successResponse";
import { ForbiddenError } from "../errors/forbidden.error";
import { groupByDate } from "../helpers";
import { isValidObjectId } from "../utils/objectIdValidator";




export const markAttendance = async (req: customRequestWithPayload<{}, any, CreateAttendanceBody>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id as string;
        const userRole = await findRoleById(userId) as roles;
        let { classId, students, studentId, attendanceDetails, ...commonAttendanceData } = req.body;

        if (classId) {
            const existingClass = await findClassById(classId);
            if (!existingClass) throw new NotFoundError('Class not found');
            if (existingClass.students.length <= 0) throw new BadRequestError('No students in this class');
            if (userRole == roles.teacher) {
                if (existingClass.teachers.includes(userId)) throw new ForbiddenError(`You have no permission to take action on class: ${classId}`);
            }
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
                if (userRole == roles.teacher) {
                    const isPermittedTeacher = await isStudentInAssignedClass(userId, studentId);
                    if (!isPermittedTeacher) throw new ForbiddenError(`You have no permission to take action on student ${studentId}`);
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
        if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof ForbiddenError) {
            return next(error);
        }
        next(new InternalServerError('Internal Server Error'));
    }
}

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

        const query: Record<string, any> = {};

        if (students.length > 0) {
            query.students = students;
        }

        if (date) query.date = date;
        if (status) query.status = status;

        const attendanceData = await findFilteredAttendance(query);
        res.status(200).json(await sendSuccessResponse('Fetched attendance data', attendanceData));
    } catch (error) {
        if (error instanceof ForbiddenError || error instanceof NotFoundError) return next(error);

        logger.error(error);
        next(new InternalServerError('Internal Server Error'));
    }
}

export const filterAndSearchAttendance = async (req: customRequestWithPayload<{}, any, any, AttendanceSearchQuery>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id as string;
        const userRole = await findRoleById(userId) as roles;
        const { studentId, date, status, startDate, endDate } = req.query;

        let students: string[] = [];

        if (userRole === roles.teacher) {
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

        const query: Record<string, any> = {};

        if (students.length > 0) query.students = students;


        if (date) query.date = date;
        else if (startDate) {
            query.date = {
                $gte: startDate,
            };
        }
        else if (endDate) {
            query.date = {
                $lte: endDate
            };
        }
        else if (startDate && endDate) {
            query.date = {
                $gte: startDate,
                $lte: endDate
            };
        }

        if (status) query.status = status;

        const attendanceData = await findFilteredAttendance(query);
        const ResponseData = groupByDate(attendanceData);
        res.status(200).json(await sendSuccessResponse('Fetched filtered Attendence Data', ResponseData));
    } catch (error) {
        if (error instanceof ForbiddenError || error instanceof NotFoundError) return next(error);

        logger.error(error);
        next(new InternalServerError('Internal Server Error'));
    }
}

export const attendanceSummary = async (req: customRequestWithPayload<{}, any, any, AttendanceSummaryQuery>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id as string;
        const userRole = await findRoleById(userId) as roles;
        const { studentId } = req.query;

        if (userRole == roles.teacher) {
            const isPermittedTeacher = await isStudentInAssignedClass(userId, studentId);
            if (!isPermittedTeacher) throw new ForbiddenError('Not permitted to access this student data');
        }
        const existingStudent = await findUserById(studentId);
        if (!existingStudent) throw new NotFoundError('Requested Student not found');
        else if (existingStudent.role !== roles.student) throw new BadRequestError('Requested StudentId not belongs to a student');

        const AttendanceSummaryData = await findAttendanceSummary(req.query);
        if (!AttendanceSummaryData) throw new NotFoundError('Not found any attendance records for requested student');

        res.status(200).json(await sendSuccessResponse('Fetched Attendance Summary', AttendanceSummaryData));
    } catch (error) {
        if (error instanceof ForbiddenError || error instanceof NotFoundError || error instanceof BadRequestError) return next(error);

        logger.error(error);
        next(new InternalServerError('Internal Server Error'));
    }
}

export const updateAttendance = async (req: customRequestWithPayload<{ id: string }, any, Partial<StanderdAttendance>>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.payload?.id as string;
        let { studentId } = req.body;
        const isValidId = isValidObjectId(id);
        if (!isValidId) throw new BadRequestError('Requested with anInvalid Id');

        const userRole = await findRoleById(userId) as roles;

        if (studentId) {
            const existingStudent = await findUserById(studentId);
            if (!existingStudent) throw new NotFoundError('Not found the requested student');
            if (existingStudent.role !== roles.student) throw new BadRequestError('Requested studentId not belongs to a student');
        }
        else {
            const attendanceData = await findAttendanceDataById(id);
            if (!attendanceData) throw new NotFoundError('Not found any attendance data with requested id');
            studentId = attendanceData.studentId.toString();
        }

        if (userRole == roles.teacher) {
            const isPermittedTeacher = await isStudentInAssignedClass(userId, studentId);
            if (!isPermittedTeacher) throw new ForbiddenError('You have no permission to update this attendance data');
        }

        logger.info(req.body)
        const updatedAttendanceData = await updateAttendanceById(id, req.body);
        res.status(200).json(await sendSuccessResponse('Attendance updated successfully', updatedAttendanceData));
    } catch (error) {
        if (error instanceof ForbiddenError || error instanceof NotFoundError || error instanceof BadRequestError) return next(error);

        logger.error(error);
        next(new InternalServerError('Internal Server Error'));
    }
}