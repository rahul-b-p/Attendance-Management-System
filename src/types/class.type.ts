import { Types } from "mongoose";



export type CreateClassBody = {
    className: string;
    teachers?: string[];
    students?: string[]|[];
}

export type ClassToUse = Required<CreateClassBody>;