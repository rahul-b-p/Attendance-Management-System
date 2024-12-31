import { Router } from "express";
import { validateReqBody, validateRole } from "../middlewares";
import { addStudentSchema, assignTeacherSchema, CreateClassSchema } from "../schemas";
import { classController } from "../controllers";
import { roles } from "../enums";


export const router = Router();

// create class
router.post('/', validateRole(roles.admin), validateReqBody(CreateClassSchema), classController.createClass);

// read all class
router.get('/', validateRole(roles.admin), classController.readAllClasses);

// assign teacher to class
router.put('/:classId/assign-teacher', validateRole(roles.admin), validateReqBody(assignTeacherSchema), classController.assignClass);

// add student to class
router.put('/:classId/add-student', validateRole(roles.admin, roles.teacher), validateReqBody(addStudentSchema), classController.addToClass);