import { Class } from "../models";
import { ClassToUse, CreateClassBody } from "../types";
import { logger } from "../utils/logger";
import { addStudentToClass, assignClassForTeachers } from "./user.service";




export const insertClass = async (userId: string, classBody: CreateClassBody): Promise<ClassToUse> => {
    try {
        let { className, students, teachers } = classBody;
        teachers = teachers ? [...teachers, userId] : [userId]
        students = students ?? [];
        const newClass = new Class({
            className, students, teachers
        });
        await newClass.save();
        const classId = newClass._id.toString();
        await addStudentToClass(students, classId);
        await assignClassForTeachers(teachers, classId);
        return newClass as ClassToUse
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message)
    }
}