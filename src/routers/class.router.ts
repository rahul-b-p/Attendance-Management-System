import { Router } from "express";
import { validateReqBody } from "../middlewares";
import { CreateClassSchema } from "../schemas/class.schema";
import { classController } from "../controllers";


export const router = Router();

// create class
router.post('/', validateReqBody(CreateClassSchema), classController.createClass);