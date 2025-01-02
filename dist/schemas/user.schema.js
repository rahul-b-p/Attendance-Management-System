"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    username: zod_1.z.string({ message: 'Username is Required' }).min(3, "Username is required"),
    email: zod_1.z.string({ message: "Email is Required" }).email("Invalid email address"),
    password: zod_1.z.string({ message: "password is required" }).min(6, "Password should be at least 6 characters")
}).strict();
exports.updatedUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username is required").optional(),
    email: zod_1.z.string().email("Invalid email address").optional(),
    password: zod_1.z.string().min(6, "Password should be at least 6 characters").optional()
}).strict().refine((data) => data.username || data.email || data.password, {
    message: 'Atleast one of Username, Email, Password is Required on update request',
    path: []
});
