import { Router } from "express";
import { validateReqBody, validateRole } from "../middlewares";
import { roles } from "../enums";
import { createAttendanceSchema } from "../schemas";
import { attendanceController } from "../controllers";


export const router = Router();

// Mark Attendance
router.post('/', validateRole(roles.admin, roles.teacher), validateReqBody(createAttendanceSchema), attendanceController.markAttendance);

// View Attendance


// Filter and Search Attendance


// Attendance Summary


// Update Attendance


// Delete Attendance