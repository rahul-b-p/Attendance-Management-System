import { Class } from "../models";
import { ClassToUse, ClassWithUserData, CreateClassBody } from "../types";
import { logger } from "../utils/logger";
import { addToAssignClasses, addToClasses, findUsersInClass } from "./user.service";




export const insertClass = async (userId: string, classBody: CreateClassBody): Promise<ClassToUse> => {
    try {
        let { className, students, teachers } = classBody;
        teachers = teachers ? [...teachers, userId] : [userId]
        students = students ? [...students] : [];
        const newClass = new Class({
            className, students, teachers
        });
        const classId = newClass._id.toString();
        await Promise.all([
            newClass.save(),
            addToClasses(students, classId),
            addToAssignClasses(teachers, classId)
        ]);
        return newClass as ClassToUse
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message)
    }
}

const toClassToUse = (classData: any): ClassToUse => {
    return {
        _id: classData._id,
        className: classData.className,
        teachers: Array.isArray(classData.teachers) ? classData.teachers : [classData.teachers],
        students: Array.isArray(classData.students) ? classData.students : [classData.students],
    };
};

export const findAllClass = async (): Promise<ClassWithUserData[]> => {
    try {
        const allClasses = (await Class.find().lean()).map(toClassToUse);

        const transformedClass: ClassWithUserData[] = await Promise.all(allClasses.map(async (user) => {
            const teacherDetails = await findUsersInClass(user.teachers);
            const studentDetails = await findUsersInClass(user.students)
            return {
                _id: user._id,
                className: user.className,
                teachers: teacherDetails,
                students: studentDetails
            } as ClassWithUserData
        }));
        return transformedClass;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message)
    }
}
