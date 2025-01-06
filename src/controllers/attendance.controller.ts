import { NextFunction, Response } from "express";
import { customRequestWithPayload } from "../interfaces";
import { logger } from "../utils/logger";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from "../errors";
import { AttendanceQuery, AttendanceSearchQuery, AttendanceSummaryQuery, CreateAttendanceBody, StanderdAttendance } from "../types";
import { deleteAttendanceById, findAttendanceDataById, findAttendanceSummary, findClassById, findFilteredAttendance, findRoleById, findUserById, getStudentsInAssignedClasses, insertAttendance, isAttendanceMarked, isClassExistsById, isStudentInAssignedClass, isStudentInClass, isTeacherInchargeOfClass, updateAttendanceById, userExistsById } from "../services";
import { DateStatus, roles } from "../enums";
import { sendSuccessResponse } from "../utils/successResponse";
import { ForbiddenError } from "../errors/forbidden.error";
import { groupByDate } from "../helpers";
import { isValidObjectId } from "../utils/objectIdValidator";
import { compareDates } from "../utils/dateUtils";




export const markAttendance = async (req: customRequestWithPayload<{}, any, CreateAttendanceBody>, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.id as string;
        const userRole = await findRoleById(userId) as roles;
        const { classId, studentId, date } = req.body;

        const dateStatus = compareDates(date);
        if (dateStatus == DateStatus.Future) throw new BadRequestError("Can't add attendance for future");
        else if (userRole == roles.teacher && dateStatus !== DateStatus.Present) throw new BadRequestError('Can only add current date attendance');

        const isClassExists = await isClassExistsById(classId);
        if (!isClassExists) throw new NotFoundError('Not Found any class with requested id');

        if (userRole == roles.teacher) {
            const isPermittedTeacher = await isTeacherInchargeOfClass(classId, userId);
            if (!isPermittedTeacher) throw new ForbiddenError("You are not permitted to mark attendance for this class");
        }

        const studentExist = await userExistsById(studentId);
        if (!studentExist) throw new NotFoundError('Not found any student with requested id');

        const isStudentPresentInClass = await isStudentInClass(classId, studentId);
        if (!isStudentPresentInClass) throw new NotFoundError('the requsted student not in the class');

        const isAttendanceAlreadyMarked = await isAttendanceMarked(date, classId, studentId);
        if (isAttendanceAlreadyMarked) throw new ConflictError('Attendance is already marked for the date, try to update if any change needs');

        const insertedAttendanceData = await insertAttendance(req.body)
        res.status(201).json(await sendSuccessResponse('Attendance marked successfully', insertedAttendanceData));

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof ForbiddenError || error instanceof ConflictError) {
            return next(error);
        }
        logger.error(error);
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
            const isStudentExists = await userExistsById(studentId);
            if (!isStudentExists) throw new NotFoundError('Requested student not found');
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
            const isStudentExists = await userExistsById(studentId);
            if (!isStudentExists) throw new NotFoundError('Requested student not found');
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

        const updatedAttendanceData = await updateAttendanceById(id, req.body);
        res.status(200).json(await sendSuccessResponse('Attendance updated successfully', updatedAttendanceData));
    } catch (error) {
        if (error instanceof ForbiddenError || error instanceof NotFoundError || error instanceof BadRequestError) return next(error);

        logger.error(error);
        next(new InternalServerError('Internal Server Error'));
    }
}

export const deleteAttendance = async (req: customRequestWithPayload<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.payload?.id as string;

        const isValidId = isValidObjectId(id);
        if (!isValidId) throw new BadRequestError('Requested with anInvalid Id');

        const attendanceData = await findAttendanceDataById(id);
        if (!attendanceData) throw new NotFoundError('Not found any attendance data with requested id');

        const existingStudent = await findUserById(attendanceData.studentId.toString());
        if (!existingStudent) throw new NotFoundError('Not found the requested student');
        if (existingStudent.role !== roles.student) throw new BadRequestError('Requested studentId not belongs to a student');

        const userRole = await findRoleById(userId) as roles;
        if (userRole == roles.teacher) {
            const isPermittedTeacher = await isStudentInAssignedClass(userId, attendanceData.studentId.toString());
            if (!isPermittedTeacher) throw new ForbiddenError('You have no permission to update this attendance data');
        }

        await deleteAttendanceById(id);
        res.status(200).json(await sendSuccessResponse('Attendance record deleted successfully'))
    } catch (error) {
        if (error instanceof ForbiddenError || error instanceof NotFoundError || error instanceof BadRequestError) return next(error);

        logger.error(error);
        next(new InternalServerError('Internal Server Error'));
    }
}