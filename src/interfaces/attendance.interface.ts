import { Document, Types } from "mongoose";
import { YYYYMMDD } from "../types";
import { status } from "../enums";




export interface IAttendance extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    date: YYYYMMDD;
    status: status;
    remarks: string;
    createAt: number;
};