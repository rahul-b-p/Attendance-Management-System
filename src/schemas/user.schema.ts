import { z } from "zod";
import { objectIdRegex } from "../utils/regex";



const ObjectIdSchema = z.string().regex(objectIdRegex, "Invalid ObjectId");

export const CreateUserSchema = z.object({
    username: z.string({message:'Username is Required'}).min(3,"Username is required"),
    email: z.string({message:"Email is Required"}).email("Invalid email address"),
    password: z.string({message:"password is required"}).min(6, "Password should be at least 6 characters"),
    assignedClasses: z.array(ObjectIdSchema).optional(),
    classes: z.array(ObjectIdSchema).optional(),
})