import { Router } from "express";
import { validateReqBody, validateReqQuery, validateRole } from "../middlewares";
import { roles } from "../enums";
import { AttendanceQuerySchema, AttendanceSearchQuerySchema, AttendanceSummaryQuerySchema, createAttendanceSchema } from "../schemas";
import { attendanceController } from "../controllers";


export const router = Router();

// Mark Attendance
router.post('/', validateRole(roles.admin, roles.teacher), validateReqBody(createAttendanceSchema), attendanceController.markAttendance);

// View Attendance
router.get('/', validateReqQuery(AttendanceQuerySchema), attendanceController.viewAttendance);

// Filter and Search Attendance
router.get('/filter', validateRole(roles.admin, roles.teacher), validateReqQuery(AttendanceSearchQuerySchema), attendanceController.filterAndSearchAttendance);

// Attendance Summary
router.get('/summary', validateRole(roles.admin, roles.teacher), validateReqQuery(AttendanceSummaryQuerySchema), attendanceController.attendanceSummary);

// Update Attendance


// Delete Attendancet