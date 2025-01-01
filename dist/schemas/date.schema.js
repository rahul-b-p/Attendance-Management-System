"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YYYYMMDDSchema = void 0;
const zod_1 = require("zod");
const regex_1 = require("../utils/regex");
exports.YYYYMMDDSchema = zod_1.z.string({ message: "Attendance recording date is Required" }).regex(regex_1.YYYYMMDDregex, "Date must be in YYYYMMDD format and valid");
