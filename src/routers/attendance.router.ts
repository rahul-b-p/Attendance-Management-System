import { Router } from "express";
import { validateReqBody, validateReqQuery, validateRole } from "../middlewares";
import { roles } from "../enums";
import { AttendanceQuerySchema, createAttendanceSchema } from "../schemas";
import { attendanceController } from "../controllers";


export const router = Router();

// Mark Attendance
router.post('/', validateRole(roles.admin, roles.teacher), validateReqBody(createAttendanceSchema), attendanceController.markAttendance);

// View Attendance
router.get('/', validateReqQuery(AttendanceQuerySchema), attendanceController.viewAttendance);

// Filter and Search Attendance


// Attendance Summary


// Update Attendance


// Delete Attendance