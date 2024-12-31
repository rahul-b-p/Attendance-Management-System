import { Types } from "mongoose";
import { UserWithoutSensitiveData } from "./user.type";



export type CreateClassBody = {
    className: string;
    teachers?: string[] | string;
    students?: string[] | string;
}

export type ClassToUse = {
    _id: Types.ObjectId;
    className: string;
    teachers: string[];
    students: string[];
};

export type ClassWithUserData = {
    _id: Types.ObjectId;
    className: string;
    teachers: UserWithoutSensitiveData[];
    students: UserWithoutSensitiveData[];
}