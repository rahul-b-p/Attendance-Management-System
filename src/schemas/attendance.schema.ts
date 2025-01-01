import { z } from "zod";
import { ObjectIdSchema } from "./id.schema";
import { YYYYMMDDSchema } from "./date.schema";
import { StatusSchema } from "./status.Schema";
import { Status } from "../enums";


const AttendanceDetailSchema = z.object({
    studentId:ObjectIdSchema,
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
}).refine((data) => {
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


