import { Router } from "express";
import { validateReqBody, validateRole } from "../middlewares";
import { roles } from "../enums";
import { CreateUserSchema, updatedUserSchema } from "../schemas";
import { userController } from "../controllers";


export const router = Router();


// create user
router.post('/:role', validateRole(roles.admin, roles.teacher), validateReqBody(CreateUserSchema), userController.createUser);

// read users
router.get('/:role', validateRole(roles.admin, roles.teacher), userController.readUser);

// update user
router.put('/:id', validateRole(roles.admin, roles.teacher), validateReqBody(updatedUserSchema), userController.updateUser);

// delete user
router.delete('/:id', validateRole(roles.admin, roles.student), userController.deleteUser);