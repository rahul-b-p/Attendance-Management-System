import { Router } from "express";
import { validateReqBody, validateRole } from "../middlewares";
import { StudentSchema, TeacherSchema, CreateClassSchema } from "../schemas";
import { classController } from "../controllers";
import { roles } from "../enums";


export const router = Router();

// create class
router.post('/', validateRole(roles.admin), validateReqBody(CreateClassSchema), classController.createClass);

// read all class
router.get('/', validateRole(roles.admin), classController.readAllClasses);

// assign teacher to class
router.put('/:classId/assign-teacher', validateRole(roles.admin), validateReqBody(TeacherSchema), classController.assignClass);

// add student to class
router.put('/:classId/add-student', validateRole(roles.admin, roles.teacher), validateReqBody(StudentSchema), classController.addToClass);

// remove teacher from class
router.put('/:classId/remove-teacher', validateRole(roles.admin), validateReqBody(TeacherSchema), classController.removeTeachers);

// remove student from class
router.put('/:classId/remove-student', validateRole(roles.admin, roles.teacher), validateReqBody(StudentSchema), classController.removeStudents);

// delete class