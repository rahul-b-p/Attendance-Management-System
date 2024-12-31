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
exports.removeTeachersFromClass = exports.addStudentToClass = exports.findClassById = exports.assignTeacherToClass = exports.findAllClass = exports.insertClass = void 0;
const models_1 = require("../models");
const logger_1 = require("../utils/logger");
const user_service_1 = require("./user.service");
const toClassToUse = (classData) => {
    return {
        _id: classData._id,
        className: classData.className,
        teachers: Array.isArray(classData.teachers) ? classData.teachers : [classData.teachers],
        students: Array.isArray(classData.students) ? classData.students : [classData.students],
    };
};
const insertClass = (userId, classBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { className, students, teachers } = classBody;
        teachers = teachers ? [...teachers, userId] : [userId];
        students = students ? [...students] : [];
        const newClass = new models_1.Class({
            className, students, teachers
        });
        const classId = newClass._id.toString();
        yield Promise.all([
            newClass.save(),
            (0, user_service_1.addToClasses)(students, classId),
            (0, user_service_1.addToAssignClasses)(teachers, classId)
        ]);
        return newClass;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.insertClass = insertClass;
const findAllClass = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allClasses = (yield models_1.Class.find().lean()).map(toClassToUse);
        const transformedClass = yield Promise.all(allClasses.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const teacherDetails = yield (0, user_service_1.findUsersInClass)(user.teachers);
            const studentDetails = yield (0, user_service_1.findUsersInClass)(user.students);
            return {
                _id: user._id,
                className: user.className,
                teachers: teacherDetails,
                students: studentDetails
            };
        })));
        return transformedClass;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.findAllClass = findAllClass;
const assignTeacherToClass = (_id, teachers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all([
            models_1.Class.updateOne({ _id }, { $addToSet: { teachers: { $each: teachers } } }),
            (0, user_service_1.addToAssignClasses)(teachers, _id)
        ]);
        const updatedClass = yield models_1.Class.findById(_id).lean();
        return toClassToUse(updatedClass);
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.assignTeacherToClass = assignTeacherToClass;
const findClassById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingClass = yield models_1.Class.findById({ _id });
        if (!existingClass)
            return null;
        else
            return toClassToUse(existingClass);
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.findClassById = findClassById;
const addStudentToClass = (_id, students) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all([
            models_1.Class.updateOne({ _id }, { $addToSet: { students: { $each: students } } }),
            (0, user_service_1.addToClasses)(students, _id)
        ]);
        const updatedClass = yield models_1.Class.findById(_id).lean();
        return toClassToUse(updatedClass);
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.addStudentToClass = addStudentToClass;
const removeTeachersFromClass = (_id, teachers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.all([
            models_1.Class.updateOne({ _id }, { $pull: { teachers: { $in: teachers } } }),
            (0, user_service_1.removeFromAssignClasses)(teachers, _id)
        ]);
        const updatedClass = yield models_1.Class.findById(_id).lean();
        return toClassToUse(updatedClass);
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.removeTeachersFromClass = removeTeachersFromClass;
