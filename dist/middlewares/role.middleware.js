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
exports.validateRole = void 0;
const errors_1 = require("../errors");
const services_1 = require("../services");
const forbidden_error_1 = require("../errors/forbidden.error");
const logger_1 = require("../utils/logger");
const validateRole = (...allowedRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
            if (!id)
                throw new Error('The user ID was not added to the payload by the authentication middleware.');
            const role = yield (0, services_1.findRoleById)(id);
            if (!role)
                return next(new errors_1.AuthenticationError('Invalid or expired access token. User not found.'));
            if (!allowedRole.includes(role))
                return next(new forbidden_error_1.ForbiddenError('Forbidden: Insufficient role privileges'));
            next();
        }
        catch (error) {
            logger_1.logger.error(error);
            next(new errors_1.InternalServerError('Something went wrong'));
        }
    });
};
exports.validateRole = validateRole;
