import { z } from "zod";
import { ObjectIdSchema } from "./id.schema";



export const CreateClassSchema = z.object({
    className: z.string({message:"Class name is required"}).min(4),
    teachers: z.array(ObjectIdSchema).optional(),
    students: z.array(ObjectIdSchema).optional()
})