import { Attendance } from "../models";
import { AttendancesToSave, AttendancesToUse, InsertAttendance } from "../types";
import { logger } from "../utils/logger";


const convertAttendanceToUse = (AttendanceData: any): AttendancesToUse => {
    return {
        _id: AttendanceData._id,
        studentId: AttendanceData.studentId,
        date: AttendanceData.date,
        status: AttendanceData.status,
        remarks:AttendanceData.remarks,
        createAt: AttendanceData.createAt
    }
}


export const insertAttendance = async (manyToOneAttendance?: AttendancesToSave, manyToManyAttendance?: InsertAttendance[]): Promise<AttendancesToUse[]> => {
    try {
        if (manyToOneAttendance && manyToManyAttendance) throw new Error('Provide only one argument.');

        if (!manyToOneAttendance && !manyToManyAttendance) throw new Error('At least one argument is required.');


        const attendanceData = manyToOneAttendance ? manyToOneAttendance.students.map((studentId) => ({
            studentId,
            date: manyToOneAttendance.date,
            status: manyToOneAttendance.status,
            remarks: manyToOneAttendance.remarks,
        })) : manyToManyAttendance;

        if (!attendanceData?.length) {
            throw new Error('No attendance data provided.');
        }


        const insertedAttendanceData = await Attendance.insertMany(attendanceData);
        return insertedAttendanceData.map(convertAttendanceToUse);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}