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
exports.checkRefreshTokenExistsById = void 0;
const models_1 = require("../models");
const logger_1 = require("../utils/logger");
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
