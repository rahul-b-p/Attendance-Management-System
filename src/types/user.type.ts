import { Types } from "mongoose";
import { roles } from "../enums";
import { classForAddInUser } from "./class.type";


export type CreateUserBody = {
    username: string;
    email: string;
    password: string;
}

export type UpdateUserBody = Partial<CreateUserBody> & { role?: roles };

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

export type UserWithoutSensitiveData = Omit<UserToUse, ('hashPassword' | 'refreshToken')>;

export type UserToShowInClass = Omit<UserWithoutSensitiveData, ('classes' | 'assignedClasses')>;

export type UserWithClassData = {
    _id: Types.ObjectId;
    username: string;
    email: string;
    role: roles;
    assignedClasses?: classForAddInUser[]
    classes?: classForAddInUser[];
}