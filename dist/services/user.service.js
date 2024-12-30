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
exports.userExistsByEmail = exports.insertUser = exports.deleteRefreshToken = exports.findUserById = exports.updateRefreshToken = exports.findUserByEmail = exports.userExistsById = exports.findRoleById = exports.checkRefreshTokenExistsById = void 0;
const models_1 = require("../models");
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const checkRefreshTokenExistsById = (_id, RefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById({ _id });
        if (!user)
            return false;
        if (user.refreshToken == RefreshToken)
            return true;
        else
            return false;
    }
    catch (error) {
        logger_1.logger.error(error.message);
        return false;
    }
});
exports.checkRefreshTokenExistsById = checkRefreshTokenExistsById;
const findRoleById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById({ _id });
        if (!user)
            return null;
        return user.role;
    }
    catch (error) {
        logger_1.logger.error(error.message);
        throw new Error(error.message);
    }
});
exports.findRoleById = findRoleById;
const userExistsById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield models_1.User.exists({ _id });
        return userExists ? true : false;
    }
    catch (error) {
        return false;
    }
});
exports.userExistsById = userExistsById;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOne({ email }).lean();
        return user;
    }
    catch (error) {
        logger_1.logger.error(error.message);
        throw new Error(error.message);
    }
});
exports.findUserByEmail = findUserByEmail;
const updateRefreshToken = (_id, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield models_1.User.findByIdAndUpdate({ _id }, { refreshToken });
        if (!updatedUser)
            throw new Error("Can't find the existing user to update");
        yield updatedUser.save();
        return;
    }
    catch (error) {
        logger_1.logger.error(error.message);
        throw new Error(error.message);
    }
});
exports.updateRefreshToken = updateRefreshToken;
const findUserById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findById({ _id }).lean();
        return user;
    }
    catch (error) {
        logger_1.logger.error(error.message);
        throw new Error(error.message);
    }
});
exports.findUserById = findUserById;
const deleteRefreshToken = (_id, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield models_1.User.findByIdAndUpdate({ _id }, { $unset: { refreshToken: 1 } });
        if (!updatedUser)
            throw new Error("Can't find the existing user to update");
        yield updatedUser.save();
        return;
    }
    catch (error) {
        logger_1.logger.error(error.message);
        throw new Error(error.message);
    }
});
exports.deleteRefreshToken = deleteRefreshToken;
const insertUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, classes, assignedClasses, role } = user;
        const hashPassword = yield (0, config_1.getEncryptedPassword)(password);
        const newUser = new models_1.User({
            username,
            email,
            hashPassword: hashPassword,
            role,
            classes,
            assignedClasses
        });
        yield newUser.save();
        const _a = newUser.toObject(), { hashPassword: _, refreshToken: __ } = _a, userWithoutSensitiveData = __rest(_a, ["hashPassword", "refreshToken"]);
        return userWithoutSensitiveData;
    }
    catch (error) {
        logger_1.logger.error(error.message);
        throw new Error(error.message);
    }
});
exports.insertUser = insertUser;
const userExistsByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExists = yield models_1.User.exists({ email });
        return userExists ? true : false;
    }
    catch (error) {
        logger_1.logger.error(error.message);
        throw new Error(error.message);
    }
});
exports.userExistsByEmail = userExistsByEmail;
