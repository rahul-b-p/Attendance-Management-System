import { Router } from "express";
import { validateReqBody, validateRole } from "../middlewares";
import { CreateClassSchema } from "../schemas/class.schema";
import { classController } from "../controllers";
import { roles } from "../enums";


export const router = Router();

// create class
router.post('/', validateRole(roles.admin), validateReqBody(CreateClassSchema), classController.createClass);

// read all class
router.get('/', validateRole(roles.admin), classController.readAllClasses);