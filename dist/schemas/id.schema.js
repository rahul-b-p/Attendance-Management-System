"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectIdSchema = void 0;
const zod_1 = require("zod");
const regex_1 = require("../utils/regex");
exports.ObjectIdSchema = zod_1.z.string().regex(regex_1.objectIdRegex, "Invalid ObjectId");
