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
exports.createDefaultAdmin = void 0;
const password_config_1 = require("../config/password.config");
const enums_1 = require("../enums");
const models_1 = require("../models");
const logger_1 = require("./logger");
const createDefaultAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminExists = yield models_1.User.exists({ role: enums_1.roles.admin });
        if (adminExists) {
            logger_1.logger.info('Admin Exists');
            return;
        }
        const username = process.env.ADMIN_USERNAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!username || !password || !email) {
            throw new Error('Admin credentials are missing!');
        }
        const hashPassword = yield (0, password_config_1.getEncryptedPassword)(password);
        const defaultAdmin = new models_1.User({
            username, email, hashPassword, role: enums_1.roles.admin
        });
        yield defaultAdmin.save();
        logger_1.logger.info('Default Admin Created');
    }
    catch (error) {
        logger_1.logger.error(`Failed to create a Default Admin:${error.message}`);
        process.exit(1);
    }
});
exports.createDefaultAdmin = createDefaultAdmin;
