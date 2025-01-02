import { Types } from "mongoose";
import { Status } from "../enums";
import { YYYYMMDD } from "./date.type";



export type CreateAttendanceBody = {
    studentId?: string;
    students?: string[];
    classId?: string;
    date: YYYYMMDD;
    status: Status;
    remarks?: string;
    attendanceDetails?: StanderdAttendance[];
}

export type AttendancesToSave = {
    students: string[];
    date: YYYYMMDD;
    status: Status;
    remarks?: string;
}

export type AttendancesToUse = {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    date: YYYYMMDD;
    status: Status;
    remarks?: string;
    createAt: string;
};

export type StanderdAttendance = {
    studentId: string;
    date: YYYYMMDD;
    status: Status;
    remarks?: string;
};

export type AttendanceQuery = Partial<Omit<StanderdAttendance, 'remarks'>>;

export type AttendanceSearchQuery = AttendanceQuery & {
    startDate?: YYYYMMDD;
    endDate?: YYYYMMDD
}

export type AttendanceSummaryQuery = {
    studentId: string;
    startDate: YYYYMMDD;
    endDate: YYYYMMDD
}

export type AttendanceToFilter = Partial<Omit<AttendancesToSave, 'remarks'>>;

export type AttendanceSummary = {
    studentId: string;
    totalDays: number;
    daysPresent: number;
    daysAbsent: number;
    attendancePercentage: number;
}