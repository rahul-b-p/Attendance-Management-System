import { z } from "zod";
import { ObjectIdSchema } from "./id.schema";
import { YYYYMMDDSchema } from "./date.schema";
import { StatusSchema } from "./status.Schema";


export const CreateAttendanceSchema = z.object({
    classId: ObjectIdSchema,
    studentId: ObjectIdSchema,
    date: YYYYMMDDSchema,
    status: StatusSchema,
    remarks: z.string().optional(),
});




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


export const updateAttendanceSchema = z.object({
    studentId: ObjectIdSchema.optional(),
    date: YYYYMMDDSchema.optional(),
    status: StatusSchema.optional(),
    remarks: z.string().optional(),
}).strict().refine((data) =>
    data.date || data.studentId || data.status || data.remarks,
    {
        message: "required atleaast any of StudentId,date,status or remarks"
    }
);