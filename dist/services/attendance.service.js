"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertAttendance = void 0;
const models_1 = require("../models");
const logger_1 = require("../utils/logger");
const convertAttendanceToUse = (AttendanceData) => {
    return {
        _id: AttendanceData._id,
        studentId: AttendanceData.studentId,
        date: AttendanceData.date,
        status: AttendanceData.status,
        remarks: AttendanceData.remarks,
        createAt: AttendanceData.createAt
    };
};
const insertAttendance = (manyToOneAttendance, manyToManyAttendance) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (manyToOneAttendance && manyToManyAttendance)
            throw new Error('Provide only one argument.');
        if (!manyToOneAttendance && !manyToManyAttendance)
            throw new Error('At least one argument is required.');
        const attendanceData = manyToOneAttendance ? manyToOneAttendance.students.map((studentId) => ({
            studentId,
            date: manyToOneAttendance.date,
            status: manyToOneAttendance.status,
            remarks: manyToOneAttendance.remarks,
        })) : manyToManyAttendance;
        if (!(attendanceData === null || attendanceData === void 0 ? void 0 : attendanceData.length)) {
            throw new Error('No attendance data provided.');
        }
        const insertedAttendanceData = yield models_1.Attendance.insertMany(attendanceData);
        return insertedAttendanceData.map(convertAttendanceToUse);
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.insertAttendance = insertAttendance;
