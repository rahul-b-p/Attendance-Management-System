import { Types } from "mongoose";



export type CreateClassBody = {
    className: string;
    teachers?: string[] | string;
    students?: string[] | string;
}

export type ClassToUse = Required<CreateClassBody>;