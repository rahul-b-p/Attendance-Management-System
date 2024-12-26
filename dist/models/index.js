"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = exports.User = void 0;
var user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_model_1).default; } });
var attendance_model_1 = require("./attendance.model");
Object.defineProperty(exports, "Attendance", { enumerable: true, get: function () { return __importDefault(attendance_model_1).default; } });
