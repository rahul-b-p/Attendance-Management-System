"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceRouter = exports.userRouter = exports.classRouter = exports.refreshRouter = exports.authRouter = void 0;
var auth_router_1 = require("./auth.router");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return auth_router_1.router; } });
var refresh_router_1 = require("./refresh.router");
Object.defineProperty(exports, "refreshRouter", { enumerable: true, get: function () { return refresh_router_1.router; } });
var class_router_1 = require("./class.router");
Object.defineProperty(exports, "classRouter", { enumerable: true, get: function () { return class_router_1.router; } });
var user_router_1 = require("./user.router");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return user_router_1.router; } });
var attendance_router_1 = require("./attendance.router");
Object.defineProperty(exports, "attendanceRouter", { enumerable: true, get: function () { return attendance_router_1.router; } });
