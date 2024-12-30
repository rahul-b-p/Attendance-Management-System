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
exports.insertClass = void 0;
const models_1 = require("../models");
const logger_1 = require("../utils/logger");
const user_service_1 = require("./user.service");
const insertClass = (userId, classBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { className, students, teachers } = classBody;
        teachers = teachers ? [...teachers, userId] : [userId];
        students = students !== null && students !== void 0 ? students : [];
        const newClass = new models_1.Class({
            className, students, teachers
        });
        yield newClass.save();
        const classId = newClass._id.toString();
        yield (0, user_service_1.addStudentToClass)(students, classId);
        yield (0, user_service_1.assignClassForTeachers)(teachers, classId);
        return newClass;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.insertClass = insertClass;
