import { z } from "zod";
import { objectIdRegex } from "../utils/regex";



export const ObjectIdSchema = z.string().regex(objectIdRegex, "Invalid ObjectId");