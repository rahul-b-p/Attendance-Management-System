import { z } from "zod";
import { ObjectIdSchema } from "./id.schema";
import { YYYYMMDDSchema } from "./date.schema";
import { StatusSchema } from "./status.Schema";


const AttendanceDetailSchema = z.object({
    studentId: ObjectIdSchema,
    date: YYYYMMDDSchema,
    status: StatusSchema,
    remarks: z.string().optional(),
});


export const createAttendanceSchema = z.object({
    studentId: ObjectIdSchema.optional(),
    students: z.array(ObjectIdSchema).optional(),
    classId: ObjectIdSchema.optional(),
    date: YYYYMMDDSchema.optional(),
    status: StatusSchema.optional(),
    remarks: z.string().optional(),
    attendanceDetails: z.array(AttendanceDetailSchema).optional()
}).strict().refine((data) => {
    if (data.attendanceDetails) {
        const { attendanceDetails, ...rest } = data;
        return Object.keys(rest).every((key) => data[key as keyof typeof data] === undefined);
    }
    return true;
}, { message: 'When attendanceDetails is provided, no other fields are allowed.' }).refine((data) => {
    if (!data.attendanceDetails) {
        const keys = ['studentId', 'students', 'classId'] as (keyof typeof data)[];
        const presentKeys = keys.filter((key) => data[key] !== undefined);
        return presentKeys.length === 1 && data.date !== undefined && data.status !== undefined;
    }
    return true;
}, { message: 'Provide exactly one of studentId, students, or classId with required non-optional fields when attendanceDetails is not provided.' });




export const AttendanceQuerySchema = z.object({
    studentId: ObjectIdSchema.optional(),
    date: YYYYMMDDSchema.optional(),
    status: StatusSchema.optional(),

}).strict();

export const AttendanceSearchQuerySchema = z.object({
    studentId: ObjectIdSchema.optional(),
    date: YYYYMMDDSchema.optional(),
    status: StatusSchema.optional(),
    startDate: YYYYMMDDSchema.optional(),
    endDate: YYYYMMDDSchema.optional()
}).strict().refine((data) => {
    return (data.date && !data.startDate && !data.endDate) ||
        (!data.date && data.startDate && data.endDate) ||
        (!data.date && !data.startDate && !data.endDate);
}, {
    message: "Only 'date' or both 'startDate' and 'endDate' are allowed in the query at a time."
});

export const AttendanceSummaryQuerySchema = z.object({
    studentId: ObjectIdSchema,
    startDate: YYYYMMDDSchema,
    endDate: YYYYMMDDSchema
}).strict();