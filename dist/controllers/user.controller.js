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
exports.updateUser = exports.readUser = exports.createUser = void 0;
const logger_1 = require("../utils/logger");
const errors_1 = require("../errors");
const enums_1 = require("../enums");
const services_1 = require("../services");
const forbidden_error_1 = require("../errors/forbidden.error");
const successResponse_1 = require("../utils/successResponse");
const objectIdValidator_1 = require("../utils/objectIdValidator");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { role } = req.params;
        if (role !== enums_1.roles.admin && role !== enums_1.roles.teacher && role !== enums_1.roles.student)
            return next(new errors_1.BadRequestError('Bad request, requested to create user with inValid role'));
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const owner = yield (0, services_1.findUserById)(userId);
        if (role == enums_1.roles.teacher || role == enums_1.roles.admin) {
            if (owner.role !== enums_1.roles.admin)
                return next(new forbidden_error_1.ForbiddenError('Forbidden: Insufficient role privileges'));
        }
        const { email } = req.body;
        const userExists = yield (0, services_1.userExistsByEmail)(email);
        if (userExists)
            return next(new errors_1.ConflictError('already a user exists on given mail adress'));
        const userToInsert = Object.assign(Object.assign({}, req.body), { role });
        const response = yield (0, services_1.insertUser)(userToInsert);
        res.status(201).json(yield (0, successResponse_1.sendSuccessResponse)('new User Created', response));
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.createUser = createUser;
const readUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { role } = req.params;
        if (role !== enums_1.roles.admin && role !== enums_1.roles.teacher && role !== enums_1.roles.student)
            return next(new errors_1.BadRequestError('Bad request, requested to create user with inValid role'));
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const owner = yield (0, services_1.findUserById)(userId);
        if (role == enums_1.roles.teacher || role == enums_1.roles.admin) {
            if (owner.role !== enums_1.roles.admin)
                return next(new forbidden_error_1.ForbiddenError('Forbidden: Insufficient role privileges'));
        }
        const allUsersWithRole = yield (0, services_1.findUserByRole)(role);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)(`Fetched all ${role}`, allUsersWithRole));
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.readUser = readUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const isValidId = (0, objectIdValidator_1.isValidObjectId)(id);
        if (!isValidId)
            return next(new errors_1.BadRequestError('Requested for an inValid Id!'));
        const existingRole = yield (0, services_1.findRoleById)(id);
        const userId = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        const owner = yield (0, services_1.findUserById)(userId);
        if (existingRole == enums_1.roles.teacher || existingRole == enums_1.roles.admin) {
            if (owner.role !== enums_1.roles.admin)
                return next(new forbidden_error_1.ForbiddenError('Forbidden: Insufficient role privileges'));
        }
        const { role } = req.body;
        if (role && owner.role !== enums_1.roles.admin)
            return next(new forbidden_error_1.ForbiddenError('Forbidden: Insufficient role privileges'));
        const updatedUser = yield (0, services_1.updateUserById)(id, req.body);
        if (!updatedUser)
            return next(new errors_1.NotFoundError('User not found for Edit'));
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Updated Succesfully', updatedUser));
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.updateUser = updateUser;
