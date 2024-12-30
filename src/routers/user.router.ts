import { Router } from "express";
import { validateReqBody, validateRole } from "../middlewares";
import { roles } from "../enums";
import { CreateUserSchema } from "../schemas";
import { userController } from "../controllers";


export const router = Router();



router.post('/:role', validateRole(roles.admin, roles.teacher), validateReqBody(CreateUserSchema), userController.createUser);