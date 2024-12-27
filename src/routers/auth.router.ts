import { Router } from "express";
import { accessTokenAuth, validateReqBody } from "../middlewares";
import { loginSchema } from "../schemas";
import { authController } from "../controllers";


export const router = Router();

router.post('/login', validateReqBody(loginSchema), authController.login);

router.post('/logout', accessTokenAuth, authController.logout);