"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const enums_1 = require("../enums");
const schemas_1 = require("../schemas");
const controllers_1 = require("../controllers");
exports.router = (0, express_1.Router)();
// Mark Attendance
exports.router.post('/', (0, middlewares_1.validateRole)(enums_1.roles.admin, enums_1.roles.teacher), (0, middlewares_1.validateReqBody)(schemas_1.createAttendanceSchema), controllers_1.attendanceController.markAttendance);
// View Attendance
exports.router.get('/', (0, middlewares_1.validateReqQuery)(schemas_1.AttendanceQuerySchema), controllers_1.attendanceController.viewAttendance);
// Filter and Search Attendance
// Attendance Summary
// Update Attendance
// Delete Attendance
