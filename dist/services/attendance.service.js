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
exports.deleteAttendanceByStudentId = exports.deleteAttendanceById = exports.updateAttendanceById = exports.findAttendanceDataById = exports.findAttendanceSummary = exports.findFilteredAttendance = exports.insertAttendance = void 0;
const enums_1 = require("../enums");
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
const convertAttendanceToStanderd = (AttendanceData) => {
    return {
        studentId: AttendanceData.studentId,
        date: AttendanceData.date,
        status: AttendanceData.status,
        remarks: AttendanceData.remarks
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
const findFilteredAttendance = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { students } = query, restQuery = __rest(query, ["students"]);
        const filteredAttendance = yield models_1.Attendance.find(Object.assign(Object.assign({}, restQuery), (students ? { studentId: { $in: students } } : {})))
            .select('studentId date status remarks')
            .lean();
        return filteredAttendance.map(convertAttendanceToStanderd);
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.findFilteredAttendance = findFilteredAttendance;
const findAttendanceSummary = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, endDate, startDate } = query;
    try {
        const attendanceData = (yield models_1.Attendance.find({
            studentId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).lean()).map(convertAttendanceToStanderd);
        const totalDays = attendanceData.length;
        if (totalDays < 0)
            return null;
        const daysPresent = attendanceData.filter(item => item.status !== enums_1.Status.absent).length;
        const daysAbsent = attendanceData.filter(item => item.status == enums_1.Status.absent).length;
        const attendancePercentage = (daysPresent / totalDays) * 100;
        return {
            studentId,
            totalDays,
            daysPresent,
            daysAbsent,
            attendancePercentage
        };
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.findAttendanceSummary = findAttendanceSummary;
const findAttendanceDataById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exisingAttendanceData = yield models_1.Attendance.findById({ _id }).lean();
        if (!exisingAttendanceData)
            return null;
        else
            return convertAttendanceToUse(exisingAttendanceData);
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.findAttendanceDataById = findAttendanceDataById;
const updateAttendanceById = (_id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedAttendanceData = yield models_1.Attendance.findByIdAndUpdate({ _id }, updateData, { new: true });
        if (!updatedAttendanceData)
            throw new Error('failed to check user existance before updating');
        yield updatedAttendanceData.save();
        return convertAttendanceToUse(updatedAttendanceData);
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.updateAttendanceById = updateAttendanceById;
const deleteAttendanceById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.Attendance.findByIdAndDelete({ _id });
        return;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.deleteAttendanceById = deleteAttendanceById;
const deleteAttendanceByStudentId = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield models_1.Attendance.deleteMany({ studentId });
        return;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new Error(error.message);
    }
});
exports.deleteAttendanceByStudentId = deleteAttendanceByStudentId;
