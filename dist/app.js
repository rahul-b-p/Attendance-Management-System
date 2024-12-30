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
const middlewares_1 = require("./middlewares");
const routers_1 = require("./routers");
const enums_1 = require("./enums");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, connections_1.connectDB)();
(0, adminSetup_1.createDefaultAdmin)();
app.use(express_1.default.json());
app.use('/auth', routers_1.authRouter);
app.use('/refresh', middlewares_1.refreshTokenAuth, routers_1.refreshRouter);
app.use(middlewares_1.accessTokenAuth);
app.use('/user', middlewares_1.validateUser, routers_1.userRouter);
app.use('/class', (0, middlewares_1.validateRole)(enums_1.roles.admin), routers_1.classRouter);
app.use('/attendance', routers_1.attendanceRouter);
app.use(middlewares_1.ErrorHandler);
app.listen(port, () => {
    logger_1.logger.info(`Server running at http://localhost:${port}`);
});
