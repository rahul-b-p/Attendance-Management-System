import { z } from "zod";
import { ObjectIdSchema } from "./id.schema";



export const CreateClassSchema = z.object({
    className: z.string({ message: "Class name is required" }).min(4),
    teachers: z.union([
        ObjectIdSchema,
        z.array(ObjectIdSchema),
    ]).transform((val) => (typeof val === "string" ? [val] : val)).optional(),
    students: z.union([
        ObjectIdSchema,
        z.array(ObjectIdSchema),
    ]).transform((val) => (typeof val === "string" ? [val] : val)).optional(),
}).strict();

export const TeacherSchema = z.object({
    teacherId: z.union([
        ObjectIdSchema,
        z.array(ObjectIdSchema),
    ]).transform((val) => (typeof val === "string" ? [val] : val))
}).strict();

export const StudentSchema = z.object({
    studentId: z.union([
        ObjectIdSchema,
        z.array(ObjectIdSchema),
    ]).transform((val) => (typeof val === "string" ? [val] : val))
}).strict();