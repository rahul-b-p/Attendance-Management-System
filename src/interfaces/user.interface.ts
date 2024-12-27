import { Document, Types } from "mongoose";
import { roles } from "../enums";

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    hashPassword: string;
    role: roles;
    refreshToken: string;
    assignedClasses:Types.ObjectId[];
    classes:Types.ObjectId[];
};
