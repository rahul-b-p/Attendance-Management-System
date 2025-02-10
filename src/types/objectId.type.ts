import { z } from "zod";
import { objectIdRegex } from "../utils/regex";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ObjectIdSchema = z.string().regex(objectIdRegex, "Invalid ObjectId");

export type ObjectIdString= z.infer<typeof ObjectIdSchema>;