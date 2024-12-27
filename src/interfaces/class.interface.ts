import { Document, Types } from "mongoose";



export interface IClass extends Document {
    _id: Types.ObjectId;
    className: string;
    teachers: Types.ObjectId[] | [];
    students: Types.ObjectId[] | [];
}