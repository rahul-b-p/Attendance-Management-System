"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const regex_1 = require("../utils/regex");
const ObjectIdSchema = zod_1.z.string().regex(regex_1.objectIdRegex, "Invalid ObjectId");
