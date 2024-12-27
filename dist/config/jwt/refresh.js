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
exports.verifyRefreshToken = exports.signRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../../utils/logger");
const signRefreshToken = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't Find secret key to sign Access token");
        }
        const RefreshToken = jsonwebtoken_1.default.sign({ id, role }, secretKey, { expiresIn: '7d' });
        return RefreshToken;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error("Can't Get Access Token");
    }
});
exports.signRefreshToken = signRefreshToken;
const verifyRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        if (!secretKey) {
            throw new Error("Can't find the secret key to sign the Access token");
        }
        const result = jsonwebtoken_1.default.verify(token, secretKey);
        return result;
    }
    catch (error) {
        throw new Error("unauthorized token");
    }
});
exports.verifyRefreshToken = verifyRefreshToken;
