"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSchema = exports.TeacherSchema = exports.CreateClassSchema = void 0;
const zod_1 = require("zod");
const id_schema_1 = require("./id.schema");
exports.CreateClassSchema = zod_1.z.object({
    className: zod_1.z.string({ message: "Class name is required" }).min(4),
    teachers: zod_1.z.union([
        id_schema_1.ObjectIdSchema,
        zod_1.z.array(id_schema_1.ObjectIdSchema),
    ]).transform((val) => (typeof val === "string" ? [val] : val)).optional(),
    students: zod_1.z.union([
        id_schema_1.ObjectIdSchema,
        zod_1.z.array(id_schema_1.ObjectIdSchema),
    ]).transform((val) => (typeof val === "string" ? [val] : val)).optional(),
}).strict();
exports.TeacherSchema = zod_1.z.object({
    teacherId: zod_1.z.union([
        id_schema_1.ObjectIdSchema,
        zod_1.z.array(id_schema_1.ObjectIdSchema),
    ]).transform((val) => (typeof val === "string" ? [val] : val))
}).strict();
exports.StudentSchema = zod_1.z.object({
    studentId: zod_1.z.union([
        id_schema_1.ObjectIdSchema,
        zod_1.z.array(id_schema_1.ObjectIdSchema),
    ]).transform((val) => (typeof val === "string" ? [val] : val))
}).strict();
