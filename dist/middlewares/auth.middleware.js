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
exports.refreshTokenAuth = exports.accessTokenAuth = void 0;
const config_1 = require("../config");
const errors_1 = require("../errors");
const logger_1 = require("../utils/logger");
const services_1 = require("../services");
const objectIdValidator_1 = require("../utils/objectIdValidator");
const accessTokenAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const AccessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!AccessToken)
            return next(new errors_1.AuthenticationError());
        const isJwtBlacklisted = yield (0, services_1.checkTokenBlacklist)(AccessToken);
        if (isJwtBlacklisted)
            return next(new errors_1.AuthenticationError());
        const tokenPayload = yield (0, config_1.verifyAccessToken)(AccessToken);
        const { id } = tokenPayload;
        const isValidId = (0, objectIdValidator_1.isValidObjectId)(id);
        if (!isValidId)
            return next(new errors_1.AuthenticationError());
        req.payload = {
            id
        };
        next();
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.AuthenticationError());
    }
});
exports.accessTokenAuth = accessTokenAuth;
const refreshTokenAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const RefreshToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!RefreshToken)
            return next(new errors_1.AuthenticationError());
        const isJwtBlacklisted = yield (0, services_1.checkTokenBlacklist)(RefreshToken);
        if (isJwtBlacklisted)
            return next(new errors_1.AuthenticationError());
        const tokenPayload = yield (0, config_1.verifyRefreshToken)(RefreshToken);
        const isRefreshTokenExists = yield (0, services_1.checkRefreshTokenExistsById)(tokenPayload.id, RefreshToken);
        if (!isRefreshTokenExists)
            return next(new errors_1.AuthenticationError());
        req.payload = { id: tokenPayload.id };
        next();
    }
    catch (error) {
        logger_1.logger.error(error);
        next(new errors_1.AuthenticationError());
    }
});
exports.refreshTokenAuth = refreshTokenAuth;
