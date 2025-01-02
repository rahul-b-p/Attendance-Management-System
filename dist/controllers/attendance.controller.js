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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendance = exports.attendanceSummary = exports.filterAndSearchAttendance = exports.viewAttendance = exports.markAttendance = void 0;
const logger_1 = require("../utils/logger");
const errors_1 = require("../errors");
const services_1 = require("../services");
const enums_1 = require("../enums");
const successResponse_1 = require("../utils/successResponse");
const forbidden_error_1 = require("../errors/forbidden.error");
const helpers_1 = require("../helpers");
const objectIdValidator_1 = require("../utils/objectIdValidator");
const markAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let _a = req.body, { classId, students, studentId, attendanceDetails } = _a, commonAttendanceData = __rest(_a, ["classId", "students", "studentId", "attendanceDetails"]);
        if (classId) {
            const existingClass = yield (0, services_1.findClassById)(classId);
            if (!existingClass)
                throw new errors_1.NotFoundError('Class not found');
            if (existingClass.students.length <= 0)
                throw new errors_1.BadRequestError('No students in this class');
            students = existingClass.students;
        }
        if (studentId) {
            students = [studentId];
        }
        if (!students && !attendanceDetails)
            throw new Error('Students or attendanceDetails must be provided');
        if (students) {
            yield Promise.all(students.map((studentId) => __awaiter(void 0, void 0, void 0, function* () {
                const existingStudent = yield (0, services_1.findUserById)(studentId);
                if (!existingStudent || existingStudent.role !== enums_1.roles.student) {
                    throw new errors_1.NotFoundError(`Student not found: ${studentId}`);
                }
            })));
        }
        if (attendanceDetails && attendanceDetails.length <= 0)
            throw new errors_1.BadRequestError('not Provided Attendance Details');
        const insertedAttendanceData = yield (0, services_1.insertAttendance)(students ? Object.assign(Object.assign({}, commonAttendanceData), { students }) : undefined, attendanceDetails);
        res.status(201).json(yield (0, successResponse_1.sendSuccessResponse)('Attendance marked successfully', insertedAttendanceData));
    }
    catch (error) {
        logger_1.logger.error(error);
        if (error instanceof errors_1.NotFoundError || error instanceof errors_1.BadRequestError) {
            return next(error);
        }
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
        logger_1.logger.info(req.body);
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
