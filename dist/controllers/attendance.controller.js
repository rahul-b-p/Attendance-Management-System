"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendance = exports.updateAttendance = exports.attendanceSummary = exports.filterAndSearchAttendance = exports.viewAttendance = exports.markAttendance = void 0;
const logger_1 = require("../utils/logger");
const errors_1 = require("../errors");
const services_1 = require("../services");
const enums_1 = require("../enums");
const successResponse_1 = require("../utils/successResponse");
const forbidden_error_1 = require("../errors/forbidden.error");
const helpers_1 = require("../helpers");
const objectIdValidator_1 = require("../utils/objectIdValidator");
const dateUtils_1 = require("../utils/dateUtils");
const markAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = yield (0, services_1.findRoleById)(userId);
        const { classId, studentId, date } = req.body;
        const dateStatus = (0, dateUtils_1.compareDates)(date);
        if (dateStatus == enums_1.DateStatus.Future)
            throw new errors_1.BadRequestError("Can't add attendance for future");
        else if (userRole == enums_1.roles.teacher && dateStatus !== enums_1.DateStatus.Present)
            throw new errors_1.BadRequestError('Can only add current date attendance');
        const isClassExists = yield (0, services_1.isClassExistsById)(classId);
        if (!isClassExists)
            throw new errors_1.NotFoundError('Not Found any class with requested id');
        if (userRole == enums_1.roles.teacher) {
            const isPermittedTeacher = yield (0, services_1.isTeacherInchargeOfClass)(classId, userId);
            if (!isPermittedTeacher)
                throw new forbidden_error_1.ForbiddenError("You are not permitted to mark attendance for this class");
        }
        const studentExist = yield (0, services_1.userExistsById)(studentId);
        if (!studentExist)
            throw new errors_1.NotFoundError('Not found any student with requested id');
        const isStudentPresentInClass = yield (0, services_1.isStudentInClass)(classId, studentId);
        if (!isStudentPresentInClass)
            throw new errors_1.NotFoundError('the requsted student not in the class');
        const isAttendanceAlreadyMarked = yield (0, services_1.isAttendanceMarked)(date, classId, studentId);
        if (isAttendanceAlreadyMarked)
            throw new errors_1.ConflictError('Attendance is already marked for the date, try to update if any change needs');
        const insertedAttendanceData = yield (0, services_1.insertAttendance)(req.body);
        res.status(201).json(yield (0, successResponse_1.sendSuccessResponse)('Attendance marked successfully', insertedAttendanceData));
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError || error instanceof errors_1.BadRequestError || error instanceof forbidden_error_1.ForbiddenError || error instanceof errors_1.ConflictError) {
            return next(error);
        }
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Internal Server Error'));
    }
});
exports.markAttendance = markAttendance;
const viewAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = yield (0, services_1.findRoleById)(userId);
        const { studentId, date, status } = req.query;
        let students = [];
        if (userRole === enums_1.roles.student) {
            students = [userId];
        }
        else if (userRole === enums_1.roles.teacher) {
            if (studentId) {
                const isPermittedTeacher = yield (0, services_1.isStudentInAssignedClass)(userId, studentId);
                if (!isPermittedTeacher)
                    throw new forbidden_error_1.ForbiddenError('Not permitted to access this student data');
                students = [studentId];
            }
            else {
                students = yield (0, services_1.getStudentsInAssignedClasses)(userId);
                if (students.length === 0)
                    throw new errors_1.NotFoundError('No students in assigned classes');
            }
        }
        else if (studentId) {
            const isStudentExists = yield (0, services_1.userExistsById)(studentId);
            if (!isStudentExists)
                throw new errors_1.NotFoundError('Requested student not found');
            students = [studentId];
        }
        const query = {};
        if (students.length > 0) {
            query.students = students;
        }
        if (date)
            query.date = date;
        if (status)
            query.status = status;
        const attendanceData = yield (0, services_1.findFilteredAttendance)(query);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Fetched attendance data', attendanceData));
    }
    catch (error) {
        if (error instanceof forbidden_error_1.ForbiddenError || error instanceof errors_1.NotFoundError)
            return next(error);
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Internal Server Error'));
    }
});
exports.viewAttendance = viewAttendance;
const filterAndSearchAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = yield (0, services_1.findRoleById)(userId);
        const { studentId, date, status, startDate, endDate } = req.query;
        let students = [];
        if (userRole === enums_1.roles.teacher) {
            if (studentId) {
                const isPermittedTeacher = yield (0, services_1.isStudentInAssignedClass)(userId, studentId);
                if (!isPermittedTeacher)
                    throw new forbidden_error_1.ForbiddenError('Not permitted to access this student data');
                students = [studentId];
            }
            else {
                students = yield (0, services_1.getStudentsInAssignedClasses)(userId);
                if (students.length === 0)
                    throw new errors_1.NotFoundError('No students in assigned classes');
            }
        }
        else if (studentId) {
            const isStudentExists = yield (0, services_1.userExistsById)(studentId);
            if (!isStudentExists)
                throw new errors_1.NotFoundError('Requested student not found');
            students = [studentId];
        }
        const query = {};
        if (students.length > 0)
            query.students = students;
        if (date)
            query.date = date;
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
        if (status)
            query.status = status;
        const attendanceData = yield (0, services_1.findFilteredAttendance)(query);
        const ResponseData = (0, helpers_1.groupByDate)(attendanceData);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Fetched filtered Attendence Data', ResponseData));
    }
    catch (error) {
        if (error instanceof forbidden_error_1.ForbiddenError || error instanceof errors_1.NotFoundError)
            return next(error);
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Internal Server Error'));
    }
});
exports.filterAndSearchAttendance = filterAndSearchAttendance;
const attendanceSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = yield (0, services_1.findRoleById)(userId);
        const { studentId } = req.query;
        if (userRole == enums_1.roles.teacher) {
            const isPermittedTeacher = yield (0, services_1.isStudentInAssignedClass)(userId, studentId);
            if (!isPermittedTeacher)
                throw new forbidden_error_1.ForbiddenError('Not permitted to access this student data');
        }
        const existingStudent = yield (0, services_1.findUserById)(studentId);
        if (!existingStudent)
            throw new errors_1.NotFoundError('Requested Student not found');
        else if (existingStudent.role !== enums_1.roles.student)
            throw new errors_1.BadRequestError('Requested StudentId not belongs to a student');
        const AttendanceSummaryData = yield (0, services_1.findAttendanceSummary)(req.query);
        if (!AttendanceSummaryData)
            throw new errors_1.NotFoundError('Not found any attendance records for requested student');
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Fetched Attendance Summary', AttendanceSummaryData));
    }
    catch (error) {
        if (error instanceof forbidden_error_1.ForbiddenError || error instanceof errors_1.NotFoundError || error instanceof errors_1.BadRequestError)
            return next(error);
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Internal Server Error'));
    }
});
exports.attendanceSummary = attendanceSummary;
const updateAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        let { studentId } = req.body;
        const isValidId = (0, objectIdValidator_1.isValidObjectId)(id);
        if (!isValidId)
            throw new errors_1.BadRequestError('Requested with anInvalid Id');
        const userRole = yield (0, services_1.findRoleById)(userId);
        if (studentId) {
            const existingStudent = yield (0, services_1.findUserById)(studentId);
            if (!existingStudent)
                throw new errors_1.NotFoundError('Not found the requested student');
            if (existingStudent.role !== enums_1.roles.student)
                throw new errors_1.BadRequestError('Requested studentId not belongs to a student');
        }
        else {
            const attendanceData = yield (0, services_1.findAttendanceDataById)(id);
            if (!attendanceData)
                throw new errors_1.NotFoundError('Not found any attendance data with requested id');
            studentId = attendanceData.studentId.toString();
        }
        if (userRole == enums_1.roles.teacher) {
            const isPermittedTeacher = yield (0, services_1.isStudentInAssignedClass)(userId, studentId);
            if (!isPermittedTeacher)
                throw new forbidden_error_1.ForbiddenError('You have no permission to update this attendance data');
        }
        const updatedAttendanceData = yield (0, services_1.updateAttendanceById)(id, req.body);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Attendance updated successfully', updatedAttendanceData));
    }
    catch (error) {
        if (error instanceof forbidden_error_1.ForbiddenError || error instanceof errors_1.NotFoundError || error instanceof errors_1.BadRequestError)
            return next(error);
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Internal Server Error'));
    }
});
exports.updateAttendance = updateAttendance;
const deleteAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const isValidId = (0, objectIdValidator_1.isValidObjectId)(id);
        if (!isValidId)
            throw new errors_1.BadRequestError('Requested with anInvalid Id');
        const attendanceData = yield (0, services_1.findAttendanceDataById)(id);
        if (!attendanceData)
            throw new errors_1.NotFoundError('Not found any attendance data with requested id');
        const existingStudent = yield (0, services_1.findUserById)(attendanceData.studentId.toString());
        if (!existingStudent)
            throw new errors_1.NotFoundError('Not found the requested student');
        if (existingStudent.role !== enums_1.roles.student)
            throw new errors_1.BadRequestError('Requested studentId not belongs to a student');
        const userRole = yield (0, services_1.findRoleById)(userId);
        if (userRole == enums_1.roles.teacher) {
            const isPermittedTeacher = yield (0, services_1.isStudentInAssignedClass)(userId, attendanceData.studentId.toString());
            if (!isPermittedTeacher)
                throw new forbidden_error_1.ForbiddenError('You have no permission to update this attendance data');
        }
        yield (0, services_1.deleteAttendanceById)(id);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Attendance record deleted successfully'));
    }
    catch (error) {
        if (error instanceof forbidden_error_1.ForbiddenError || error instanceof errors_1.NotFoundError || error instanceof errors_1.BadRequestError)
            return next(error);
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Internal Server Error'));
    }
});
exports.deleteAttendance = deleteAttendance;
