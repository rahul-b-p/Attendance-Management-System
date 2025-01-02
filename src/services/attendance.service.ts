import { Status } from "../enums";
import { Attendance } from "../models";
import { AttendanceQuery, AttendancesToSave, AttendancesToUse, AttendanceSummary, AttendanceSummaryQuery, AttendanceToFilter, StanderdAttendance } from "../types";
import { logger } from "../utils/logger";


const convertAttendanceToUse = (AttendanceData: any): AttendancesToUse => {
    return {
        _id: AttendanceData._id,
        studentId: AttendanceData.studentId,
        date: AttendanceData.date,
        status: AttendanceData.status,
        remarks: AttendanceData.remarks,
        createAt: AttendanceData.createAt
    }
}
const convertAttendanceToStanderd = (AttendanceData: any): StanderdAttendance => {
    return {
        studentId: AttendanceData.studentId,
        date: AttendanceData.date,
        status: AttendanceData.status,
        remarks: AttendanceData.remarks
    }
}


export const insertAttendance = async (manyToOneAttendance?: AttendancesToSave, manyToManyAttendance?: StanderdAttendance[]): Promise<AttendancesToUse[]> => {
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

export const findFilteredAttendance = async (query: AttendanceToFilter): Promise<StanderdAttendance[]> => {
    try {
        const { students, ...restQuery } = query;

        const filteredAttendance = await Attendance.find({
            ...restQuery,
            ...(students ? { studentId: { $in: students } } : {})
        })
            .select('studentId date status remarks')
            .lean();

        return filteredAttendance.map(convertAttendanceToStanderd);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const findAttendanceSummary = async (query: AttendanceSummaryQuery): Promise<AttendanceSummary | null> => {
    const { studentId, endDate, startDate } = query
    try {
        const attendanceData = (await Attendance.find({
            studentId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).lean()).map(convertAttendanceToStanderd);
        const totalDays = attendanceData.length;
        if (totalDays < 0) return null;
        const daysPresent = attendanceData.filter(item => item.status !== Status.absent).length;
        const daysAbsent = attendanceData.filter(item => item.status == Status.absent).length;
        const attendancePercentage = (daysPresent / totalDays) * 100;
        return {
            studentId,
            totalDays,
            daysPresent,
            daysAbsent,
            attendancePercentage
        }
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const findAttendanceDataById = async (_id: string): Promise<AttendancesToUse | null> => {
    try {
        const exisingAttendanceData = await Attendance.findById({ _id }).lean();
        if (!exisingAttendanceData) return null
        else return convertAttendanceToUse(exisingAttendanceData);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const updateAttendanceById = async (_id: string, updateData: Partial<StanderdAttendance>): Promise<AttendancesToUse> => {
    try {
        const updatedAttendanceData = await Attendance.findByIdAndUpdate({ _id }, updateData, { new: true });
        if (!updatedAttendanceData) throw new Error('failed to check user existance before updating');
        await updatedAttendanceData.save();
        return convertAttendanceToUse(updatedAttendanceData);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const deleteAttendanceById = async (_id: string): Promise<void> => {
    try {
        await Attendance.findByIdAndDelete({ _id });
        return;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const deleteAttendanceByStudentId = async (studentId: string): Promise<void> => {
    try {
        await Attendance.deleteMany({ studentId });
        return;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}