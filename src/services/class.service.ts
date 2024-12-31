import { Class } from "../models";
import { ClassToUse, ClassWithUserData, CreateClassBody } from "../types";
import { logger } from "../utils/logger";
import { addToAssignClasses, addToClasses, findUsersInClass, removeIdFromAssignClasses, removeIdFromClasses } from "./user.service";


const toClassToUse = (classData: any): ClassToUse => {
    return {
        _id: classData._id,
        className: classData.className,
        teachers: Array.isArray(classData.teachers) ? classData.teachers : [classData.teachers],
        students: Array.isArray(classData.students) ? classData.students : [classData.students],
    };
};


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
        throw new Error(error.message);
    }
}

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
        throw new Error(error.message);
    }
}

export const assignTeacherToClass = async (_id: string, teachers: string[]): Promise<ClassToUse> => {
    try {
        await Promise.all([
            Class.updateOne({ _id }, { $addToSet: { teachers: { $each: teachers } } }),
            addToAssignClasses(teachers, _id)
        ]);
        const updatedClass = await Class.findById(_id).lean();
        return toClassToUse(updatedClass);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const findClassById = async (_id: string): Promise<ClassToUse | null> => {
    try {
        const existingClass = await Class.findById({ _id })
        if (!existingClass) return null;
        else return toClassToUse(existingClass);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const addStudentToClass = async (_id: string, students: string[]): Promise<ClassToUse> => {
    try {
        await Promise.all([
            Class.updateOne({ _id }, { $addToSet: { students: { $each: students } } }),
            addToClasses(students, _id)
        ]);
        const updatedClass = await Class.findById(_id).lean();
        return toClassToUse(updatedClass);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const removeTeachersFromClass = async (_id: string, teachers: string[]): Promise<ClassToUse> => {
    try {
        await Promise.all([
            Class.updateOne({ _id }, { $pull: { teachers: { $in: teachers } } }),
            removeIdFromAssignClasses(teachers, _id)
        ]);
        const updatedClass = await Class.findById(_id).lean();
        return toClassToUse(updatedClass);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const removeStudentFromClass = async (_id: string, students: string[]): Promise<ClassToUse> => {
    try {
        await Promise.all([
            Class.updateOne({ _id }, { $pull: { students: { $in: students } } }),
            removeIdFromClasses(students, _id)
        ]);
        const updatedClass = await Class.findById(_id).lean();
        return toClassToUse(updatedClass);
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const deleteClassById = async (_id: string): Promise<boolean> => {
    try {
        const existingClass = await findClassById(_id);
        if(!existingClass) return false;

        await Promise.all([
            Class.deleteOne({_id}),
            removeIdFromAssignClasses(existingClass.teachers,_id),
            removeIdFromClasses(existingClass.students,_id)
        ]);
        return true;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}