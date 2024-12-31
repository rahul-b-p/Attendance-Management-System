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
exports.createClass = void 0;
const errors_1 = require("../errors");
const logger_1 = require("../utils/logger");
const services_1 = require("../services");
const successResponse_1 = require("../utils/successResponse");
const enums_1 = require("../enums");
const createClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        let { students, teachers } = req.body;
        if (students) {
            students = Array.isArray(students) ? students : [students];
            yield Promise.all(students.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const existingStudent = yield (0, services_1.findUserById)(item);
                if (!existingStudent || existingStudent.role !== enums_1.roles.student)
                    return next(new errors_1.NotFoundError(`No student found with the given ID: "${item}"`));
            })));
        }
        if (teachers) {
            teachers = Array.isArray(teachers) ? teachers : [teachers];
            yield Promise.all(teachers.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                const existingTeacher = yield (0, services_1.findUserById)(item);
                if (!existingTeacher || existingTeacher.role == enums_1.roles.student)
                    return next(new errors_1.NotFoundError(`No teacher or admin found with the given ID: "${item}"`));
            })));
        }
        const newClass = yield (0, services_1.insertClass)(userId, req.body);
        res.status(201).json(yield (0, successResponse_1.sendSuccessResponse)('New Class created with given data', newClass));
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.createClass = createClass;
