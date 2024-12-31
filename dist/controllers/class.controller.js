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
exports.removeTeacher = exports.addToClass = exports.assignClass = exports.readAllClasses = exports.createClass = void 0;
const errors_1 = require("../errors");
const logger_1 = require("../utils/logger");
const services_1 = require("../services");
const successResponse_1 = require("../utils/successResponse");
const enums_1 = require("../enums");
const objectIdValidator_1 = require("../utils/objectIdValidator");
const forbidden_error_1 = require("../errors/forbidden.error");
const createClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        let { students, teachers } = req.body;
        if (students) {
            students = Array.isArray(students) ? students : [students];
            yield Promise.all(students.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const existingStudent = yield (0, services_1.findUserById)(item);
                if (!existingStudent || existingStudent.role !== enums_1.roles.student) {
                    throw new errors_1.NotFoundError(`No student found with the given ID: "${item}"`);
                }
            })));
        }
        if (teachers) {
            teachers = Array.isArray(teachers) ? teachers : [teachers];
            yield Promise.all(teachers.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const existingTeacher = yield (0, services_1.findUserById)(item);
                if (!existingTeacher || existingTeacher.role === enums_1.roles.student) {
                    throw new errors_1.NotFoundError(`No teacher or admin found with the given ID: "${item}"`);
                }
            })));
        }
        const newClass = yield (0, services_1.insertClass)(userId, req.body);
        res.status(201).json(yield (0, successResponse_1.sendSuccessResponse)('New Class created with given data', newClass));
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            return next(error);
        }
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.createClass = createClass;
const readAllClasses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allClasses = yield (0, services_1.findAllClass)();
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Fetched All Class Data', allClasses));
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.readAllClasses = readAllClasses;
const assignClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const isValidClassId = (0, objectIdValidator_1.isValidObjectId)(classId);
        if (!isValidClassId)
            return next(new errors_1.BadRequestError('Requested with an Invalid Class Id'));
        const existingClass = yield (0, services_1.findClassById)(classId);
        if (!existingClass)
            return next(new errors_1.NotFoundError('Requested class not found!'));
        let { teacherId } = req.body;
        teacherId = Array.isArray(teacherId) ? teacherId : [teacherId];
        yield Promise.all(teacherId.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            const userRoleFromTeacherId = yield (0, services_1.findRoleById)(id);
            if (!userRoleFromTeacherId)
                throw new errors_1.NotFoundError(`teacher with id: ${id} not found`);
            else if (userRoleFromTeacherId == enums_1.roles.student)
                throw new forbidden_error_1.ForbiddenError(`You have no permission to assign class for id: ${id}`);
        })));
        const existingTeacherIds = existingClass.teachers.map(teacher => teacher.toString());
        const repeatedTeachers = teacherId.filter(id => existingTeacherIds.includes(id));
        if (repeatedTeachers.length > 0) {
            return next(new errors_1.ConflictError(`The following teacher(s) are already assigned to this class: ${repeatedTeachers.join(', ')}`));
        }
        const updatedClass = yield (0, services_1.assignTeacherToClass)(classId, teacherId);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Updated Successfully', updatedClass));
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError)
            return next(error);
        else if (error instanceof forbidden_error_1.ForbiddenError)
            return next(error);
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.assignClass = assignClass;
const addToClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const isValidClassId = (0, objectIdValidator_1.isValidObjectId)(classId);
        if (!isValidClassId)
            return next(new errors_1.BadRequestError('Requested with an Invalid Class Id'));
        const existingClass = yield (0, services_1.findClassById)(classId);
        if (!existingClass)
            return next(new errors_1.NotFoundError('Requested class not found!'));
        let { studentId } = req.body;
        studentId = Array.isArray(studentId) ? studentId : [studentId];
        yield Promise.all(studentId.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            const userRoleFromStudentId = yield (0, services_1.findRoleById)(id);
            if (!userRoleFromStudentId)
                throw new errors_1.NotFoundError(`student with id: ${id} not found`);
            else if (userRoleFromStudentId !== enums_1.roles.student)
                throw new forbidden_error_1.ForbiddenError(`You can't add a non-student of following id to a class, id: ${id}`);
        })));
        const existingStudentIds = existingClass.students.map(student => student.toString());
        const repeatedStudents = studentId.filter(id => existingStudentIds.includes(id));
        if (repeatedStudents.length > 0) {
            return next(new errors_1.ConflictError(`The following student(s) are already assigned to this class: ${repeatedStudents.join(', ')}`));
        }
        const updatedClass = yield (0, services_1.addStudentToClass)(classId, studentId);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Updated Successfully', updatedClass));
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError)
            return next(error);
        else if (error instanceof forbidden_error_1.ForbiddenError)
            return next(error);
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.addToClass = addToClass;
const removeTeacher = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const isValidClassId = (0, objectIdValidator_1.isValidObjectId)(classId);
        if (!isValidClassId)
            return next(new errors_1.BadRequestError('Requested with an Invalid Class Id'));
        const existingClass = yield (0, services_1.findClassById)(classId);
        if (!existingClass)
            return next(new errors_1.NotFoundError('Requested class not found!'));
        let { teacherId } = req.body;
        teacherId = Array.isArray(teacherId) ? teacherId : [teacherId];
        yield Promise.all(teacherId.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            const userRoleFromTeacherId = yield (0, services_1.findRoleById)(id);
            if (!userRoleFromTeacherId)
                throw new errors_1.NotFoundError(`teacher with id: ${id} not found`);
            else if (userRoleFromTeacherId == enums_1.roles.student)
                throw new forbidden_error_1.ForbiddenError(`You have no permission to assign class for id: ${id}`);
        })));
        const existingTeacherIds = existingClass.teachers.map(teacher => teacher.toString());
        const repeatedTeachers = teacherId.filter(id => existingTeacherIds.includes(id));
        if (repeatedTeachers.length <= 0) {
            return next(new errors_1.NotFoundError(`The following teacher(s) are not found in given class: ${repeatedTeachers.join(', ')}`));
        }
        const updatedClass = yield (0, services_1.removeTeachersFromClass)(classId, teacherId);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Updated Successfully', updatedClass));
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError)
            return next(error);
        else if (error instanceof forbidden_error_1.ForbiddenError)
            return next(error);
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.removeTeacher = removeTeacher;
