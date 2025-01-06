"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendanceSchema = exports.AttendanceSummaryQuerySchema = exports.AttendanceSearchQuerySchema = exports.AttendanceQuerySchema = exports.CreateAttendanceSchema = void 0;
const zod_1 = require("zod");
const id_schema_1 = require("./id.schema");
const date_schema_1 = require("./date.schema");
const status_Schema_1 = require("./status.Schema");
exports.CreateAttendanceSchema = zod_1.z.object({
    classId: id_schema_1.ObjectIdSchema,
    studentId: id_schema_1.ObjectIdSchema,
    date: date_schema_1.YYYYMMDDSchema,
    status: status_Schema_1.StatusSchema,
    remarks: zod_1.z.string().optional(),
});
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
