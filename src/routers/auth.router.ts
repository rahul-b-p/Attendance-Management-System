import { Router } from "express";
import { validateReqBody } from "../middlewares";
import { loginSchema } from "../schemas";
import { authController } from "../controllers";


export const router = Router();

router.post('/login', validateReqBody(loginSchema), authController.login);