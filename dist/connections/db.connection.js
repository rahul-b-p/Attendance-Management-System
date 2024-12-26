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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connectionString = process.env.DATABASE;
        if (!connectionString)
            throw new Error("The database connection string is not properly assigned to the project's environment configuration.");
        const mongoConnect = yield mongoose_1.default.connect(connectionString);
        logger_1.logger.info(`Mongo Connected:${mongoConnect.connection.host}`);
    }
    catch (error) {
        logger_1.logger.error(`Failed to connect with mongo:${error.message}`);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
