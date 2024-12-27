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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTokenBlacklist = exports.blackListToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const models_1 = require("../models");
const blackListToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { exp } = jsonwebtoken_1.default.decode(token);
        const expireAt = new Date(exp * 1000);
        const blacklistedToken = new models_1.BlacklistToken({ token, expireAt });
        yield blacklistedToken.save();
        return;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error("Can't Blacklist Token due to an error");
    }
});
exports.blackListToken = blackListToken;
const checkTokenBlacklist = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isJwtBlacklisted = yield models_1.BlacklistToken.findOne({ token });
        return isJwtBlacklisted ? true : false;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error("Can't check the token now");
    }
});
exports.checkTokenBlacklist = checkTokenBlacklist;
