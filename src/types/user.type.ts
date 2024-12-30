import { Types } from "mongoose";
import { roles } from "../enums";




export type UserToUse = {
    _id: Types.ObjectId;
    username: string;
    email: string;
    hashPassword: string;
    role: roles;
    refreshToken: string;
    assignedClasses: Types.ObjectId[];
    classes: Types.ObjectId[];
}

export type UserWithoutSensitiveData = Omit<UserToUse, ('hashPassword'|'refreshToken')>