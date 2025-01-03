"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendanceSchema = exports.AttendanceSummaryQuerySchema = exports.AttendanceSearchQuerySchema = exports.AttendanceQuerySchema = exports.createAttendanceSchema = void 0;
const zod_1 = require("zod");
const id_schema_1 = require("./id.schema");
const date_schema_1 = require("./date.schema");
const status_Schema_1 = require("./status.Schema");
const AttendanceDetailSchema = zod_1.z.object({
    studentId: id_schema_1.ObjectIdSchema,
    date: date_schema_1.YYYYMMDDSchema,
    status: status_Schema_1.StatusSchema,
    remarks: zod_1.z.string().optional(),
});
exports.createAttendanceSchema = zod_1.z.object({
    studentId: id_schema_1.ObjectIdSchema.optional(),
    students: zod_1.z.array(id_schema_1.ObjectIdSchema).optional(),
    classId: id_schema_1.ObjectIdSchema.optional(),
    date: date_schema_1.YYYYMMDDSchema.optional(),
    status: status_Schema_1.StatusSchema.optional(),
    remarks: zod_1.z.string().optional(),
    attendanceDetails: zod_1.z.array(AttendanceDetailSchema).optional()
}).strict().refine((data) => {
    if (data.attendanceDetails) {
        const { attendanceDetails } = data, rest = __rest(data, ["attendanceDetails"]);
        return Object.keys(rest).every((key) => data[key] === undefined);
    }
    return true;
}, { message: 'When attendanceDetails is provided, no other fields are allowed.' }).refine((data) => {
    if (!data.attendanceDetails) {
        const keys = ['studentId', 'students', 'classId'];
        const presentKeys = keys.filter((key) => data[key] !== undefined);
        return presentKeys.length === 1 && data.date !== undefined && data.status !== undefined;
    }
    return true;
}, { message: 'Provide exactly one of studentId, students, or classId with required non-optional fields when attendanceDetails is not provided.' });
exports.AttendanceQuerySchema = zod_1.z.object({
    studentId: id_schema_1.ObjectIdSchema.optional(),
    date: date_schema_1.YYYYMMDDSchema.optional(),
    status: status_Schema_1.StatusSchema.optional(),
}).strict();
exports.AttendanceSearchQuerySchema = zod_1.z.object({
    studentId: id_schema_1.ObjectIdSchema.optional(),
    date: date_schema_1.YYYYMMDDSchema.optional(),
    status: status_Schema_1.StatusSchema.optional(),
    startDate: date_schema_1.YYYYMMDDSchema.optional(),
    endDate: date_schema_1.YYYYMMDDSchema.optional()
}).strict().refine((data) => {
    return (data.date && !data.startDate && !data.endDate) ||
        (!data.date && data.startDate && data.endDate) ||
        (!data.date && !data.startDate && !data.endDate);
}, {
    message: "Only 'date' or both 'startDate' and 'endDate' are allowed in the query at a time."
});
exports.AttendanceSummaryQuerySchema = zod_1.z.object({
    studentId: id_schema_1.ObjectIdSchema,
    startDate: date_schema_1.YYYYMMDDSchema,
    endDate: date_schema_1.YYYYMMDDSchema
}).strict();
exports.updateAttendanceSchema = zod_1.z.object({
    studentId: id_schema_1.ObjectIdSchema.optional(),
    date: date_schema_1.YYYYMMDDSchema.optional(),
    status: status_Schema_1.StatusSchema.optional(),
    remarks: zod_1.z.string().optional(),
}).strict().refine((data) => data.date || data.studentId || data.status || data.remarks, {
    message: "required atleaast any of StudentId,date,status or remarks"
});
