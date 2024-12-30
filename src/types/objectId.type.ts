import { z } from "zod";
import { objectIdRegex } from "../utils/regex";


const ObjectIdSchema = z.string().regex(objectIdRegex, "Invalid ObjectId");

export type ObjectIdString= z.infer<typeof ObjectIdSchema>