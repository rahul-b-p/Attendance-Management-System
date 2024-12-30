import { ObjectIdString } from "./objectId.type";


export type LoginBody = {
    email: string;
    password: string;
}

export type CreateUserBody = {
    username: string;
    email: string;
    password: string;
    assignedClasses: ObjectIdString[]
    classes: ObjectIdString[]
}