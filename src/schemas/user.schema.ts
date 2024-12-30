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

export const updatedUserSchema = z.object({
    username: z.string().min(3, "Username is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password should be at least 6 characters").optional(),
    assignedClasses: z.array(ObjectIdSchema).optional(),
    classes: z.array(ObjectIdSchema).optional(),
}).refine(
    (data)=>data.username||data.email||data.password,
    {
        message:'Atleast one of Username, Email, Password is Required on update request',
        path:[]
    });
    