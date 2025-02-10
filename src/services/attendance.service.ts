import { Status } from "../enums";
import { Attendance } from "../models";
import { AttendancesToUse, AttendanceSummary, AttendanceSummaryQuery, AttendanceToFilter, CreateAttendanceBody, StanderdAttendance, YYYYMMDD } from "../types";
import { logger } from "../utils/logger";


const convertAttendanceToUse = (AttendanceData: any): AttendancesToUse => {
    return {
        _id: AttendanceData._id,
        studentId: AttendanceData.studentId,
        classId: AttendanceData.classId,
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

export const insertAttendance = async (attendanceData: CreateAttendanceBody): Promise<AttendancesToUse> => {
    try {
        const { studentId, classId, date, status, remarks } = attendanceData;
        const insertedAttendanceData = new Attendance({
            studentId, classId, date, status, remarks
        });
        await insertedAttendanceData.save();
        return convertAttendanceToUse(insertedAttendanceData);
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

export const isAttendanceMarked = async (date: YYYYMMDD, classId: string, studentId: string) => {
    try {
        const markedAttendance = await Attendance.findOne({ studentId, classId, date });
        if (markedAttendance) return true;
        else return false
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}