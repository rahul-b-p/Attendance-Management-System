"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
const regex_1 = require("../utils/regex");
const ObjectIdSchema = zod_1.z.string().regex(regex_1.objectIdRegex, "Invalid ObjectId");
exports.CreateUserSchema = zod_1.z.object({
    username: zod_1.z.string({ message: 'Username is Required' }).min(3, "Username is required"),
    email: zod_1.z.string({ message: "Email is Required" }).email("Invalid email address"),
    password: zod_1.z.string({ message: "password is required" }).min(6, "Password should be at least 6 characters"),
    assignedClasses: zod_1.z.array(ObjectIdSchema).optional(),
    classes: zod_1.z.array(ObjectIdSchema).optional(),
});
