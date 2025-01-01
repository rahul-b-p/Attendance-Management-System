"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../enums");
exports.StatusSchema = zod_1.z.nativeEnum(enums_1.Status, { message: "status is required, and should be 'present' or 'absent' or 'absent'" });
