import { Document, Types } from "mongoose";
import { YYYYMMDD } from "../types";
import { Status } from "../enums";




export interface IAttendance extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    classId:Types.ObjectId;
    date: YYYYMMDD;
    status: Status;
    remarks?: string;
    createAt?: string;
};