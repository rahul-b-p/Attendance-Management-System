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
exports.verifyPassword = exports.getEncryptedPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../utils/logger");
const getEncryptedPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt_1.default.genSalt(Number(process.env.SALT));
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        return encryptedPassword;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error("An Error occur while password encryption");
    }
});
exports.getEncryptedPassword = getEncryptedPassword;
const verifyPassword = (password, hashPass) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isVerifiedPassword = yield bcrypt_1.default.compare(password, hashPass);
        return isVerifiedPassword;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error("An Error occur while password verification");
    }
});
exports.verifyPassword = verifyPassword;
