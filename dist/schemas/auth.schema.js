"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string({ message: 'Email is required in the request body.' }).email({ message: 'Invalid email format' }),
    password: zod_1.default.string({ message: 'Password is required in the request body.' }).min(6, { message: 'Password must be at least 6 characters long' })
});
exports.signupSchema = zod_1.default.object({
    username: zod_1.default.string({ message: 'Username is required in the request body' }).min(3, { message: 'Username must be at least 6 Characters long' }),
    email: zod_1.default.string({ message: 'Email is required in the request body.' }).email({ message: 'Invalid email format' }),
    password: zod_1.default.string({ message: 'Password is required in the request body.' }).min(6, { message: 'Password must be at least 6 characters long' })
});
