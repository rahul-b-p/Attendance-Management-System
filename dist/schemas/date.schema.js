"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YYYYMMDDSchema = void 0;
const zod_1 = require("zod");
const regex_1 = require("../utils/regex");
exports.YYYYMMDDSchema = zod_1.z.string({
    message: "Attendance recording date is required",
}).regex(regex_1.YYYYMMDDregex, "Date must be in YYYY-MM-DD format").refine((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day);
}, "Invalid date").transform((dateStr) => {
    return dateStr;
});
