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
exports.refreshToken = exports.login = void 0;
const logger_1 = require("../utils/logger");
const errors_1 = require("../errors");
const config_1 = require("../config");
const successResponse_1 = require("../utils/successResponse");
const services_1 = require("../services");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield (0, services_1.findUserByEmail)(email);
        if (!existingUser)
            return next(new errors_1.NotFoundError('User not found with given email id'));
        const isVerifiedPassword = yield (0, config_1.verifyPassword)(password, existingUser.hashPassword);
        if (!isVerifiedPassword)
            return next(new errors_1.AuthenticationError('Invalid Password'));
        const AccessToken = yield (0, config_1.signAccessToken)(existingUser._id.toString(), existingUser.role);
        const RefreshToken = yield (0, config_1.signRefreshToken)(existingUser._id.toString(), existingUser.role);
        yield (0, services_1.updateRefreshToken)(existingUser._id, RefreshToken);
        res.statusMessage = "Login Successful";
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Login Successful', { AccessToken, RefreshToken }));
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError());
    }
});
exports.login = login;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = req.payload) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            throw new Error('The user ID was not added to the payload by the authentication middleware.');
        const existingUser = yield (0, services_1.findUserById)(id);
        if (!existingUser)
            return next(new errors_1.NotFoundError());
        const AccessToken = yield (0, config_1.signAccessToken)(existingUser._id.toString(), existingUser.role);
        const RefreshToken = yield (0, config_1.signRefreshToken)(existingUser._id.toString(), existingUser.role);
        yield (0, services_1.updateRefreshToken)(existingUser._id, RefreshToken);
        res.status(200).json(yield (0, successResponse_1.sendSuccessResponse)('Token refreshed successfully', { AccessToken, RefreshToken }));
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.InternalServerError('Something went wrong'));
    }
});
exports.refreshToken = refreshToken;
