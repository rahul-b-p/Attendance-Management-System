"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const logger_1 = require("./utils/logger");
const connections_1 = require("./connections");
const adminSetup_1 = require("./utils/adminSetup");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, connections_1.connectDB)();
(0, adminSetup_1.createDefaultAdmin)();
app.listen(port, () => {
    logger_1.logger.info(`Server running at http://localhost:${port}`);
});
