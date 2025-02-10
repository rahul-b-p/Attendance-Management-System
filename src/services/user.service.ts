/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { roles } from "../enums";
import { User } from "../models";
import { logger } from "../utils/logger";
import { CreateUserBody, UpdateUserBody, UserToShowInClass, UserToUse, UserWithClassData, UserWithoutSensitiveData } from "../types";
import { getEncryptedPassword } from "../config";
import { findClassNameByIds, removeUserIdFromAllClass } from "./class.service";
import { deleteAttendanceByStudentId } from "./attendance.service";


const convertUserToUseInClassData = (userData: any): UserToShowInClass => {
    return {
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        role: userData.role
    };
}
const checkStudentAndDeleteAttendance = (userData: UserToUse): Promise<boolean> => {
    if (userData.role !== roles.student) {
        return new Promise((resolve) => {
            resolve(true)
        })
    }
    else {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                await deleteAttendanceByStudentId(userData._id.toString());
                resolve(true)
            } catch (error: any) {
                reject(`Failed to delete attendance data:${error.message}`,);
            }
        })
    }
}


export const checkRefreshTokenExistsById = async (_id: string, RefreshToken: string): Promise<boolean> => {
    try {
        const user = await User.findById({ _id });
        if (!user) return false;
        if (user.refreshToken == RefreshToken) return true;
        else return false;
    } catch (error: any) {
        logger.error(error.message);
        return false;
    }
}

export const findRoleById = async (_id: string): Promise<roles | null> => {
    try {
        const user = await User.findById({ _id });
        if (!user) return null;
        return user.role;
    } catch (error: any) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const userExistsById = async (_id: string): Promise<boolean> => {
    try {
        const userExists = await User.exists({ _id });
        return userExists ? true : false;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
        return false;
    }
}

export const findUserByEmail = async (email: string): Promise<UserToUse | null> => {
    try {
        const user = await User.findOne({ email }).lean() as UserToUse
        return user;
    } catch (error: any) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const updateRefreshToken = async (_id: Types.ObjectId, refreshToken: string): Promise<void> => {
    try {
        const updatedUser = await User.findByIdAndUpdate({ _id }, { refreshToken });
        if (!updatedUser) throw new Error("Can't find the existing user to update");
        await updatedUser.save();
        return;
    } catch (error: any) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const findUserById = async (_id: string): Promise<UserToUse | null> => {
    try {
        const user = await User.findById({ _id }).lean() as UserToUse;
        return user;
    } catch (error: any) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deleteRefreshToken = async (_id: Types.ObjectId, refreshToken: string): Promise<void> => {
    try {
        const updatedUser = await User.findByIdAndUpdate({ _id }, { $unset: { refreshToken: 1 } });
        if (!updatedUser) throw new Error("Can't find the existing user to update");
        await updatedUser.save();
        return;
    } catch (error: any) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const insertUser = async (user: CreateUserBody & { role: roles }): Promise<UserWithoutSensitiveData> => {
    try {
        const { username, password, email, role } = user
        const hashedPassword = await getEncryptedPassword(password)
        const newUser = new User({
            username,
            email,
            hashPassword: hashedPassword,
            role
        });
        await newUser.save();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashPassword, refreshToken, ...userWithoutSensitiveData } = newUser.toObject();
        return userWithoutSensitiveData as UserWithoutSensitiveData;
    } catch (error: any) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const userExistsByEmail = async (email: string): Promise<boolean> => {
    try {
        const userExists = await User.exists({ email });
        return userExists ? true : false;
    } catch (error: any) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

export const findUserByRole = async (role: roles): Promise<UserWithoutSensitiveData[]> => {
    try {
        const users = await User.find({ role }).select("-hashPassword -refreshToken");
        return users as UserWithoutSensitiveData[];
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const updateUserById = async (_id: string, updateUserBody: UpdateUserBody): Promise<UserWithoutSensitiveData | null> => {
    try {
        const { username, password, email, role } = updateUserBody;
        const existingUser = await findUserById(_id);
        if (!existingUser) return null;
        const hashedPassword = password ? await getEncryptedPassword(password) : existingUser?.hashPassword
        const updatedUser = await User.findByIdAndUpdate({ _id }, {
            username: username ? username : existingUser.username,
            email: email ? email : existingUser.email,
            hashPassword: hashedPassword,
            role: role ? role : existingUser.role
        }, { new: true });
        if (!updatedUser) return null;
        await updatedUser.save();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashPassword, refreshToken, ...userWithoutSensitiveData } = updatedUser.toObject();
        return userWithoutSensitiveData as UserWithoutSensitiveData;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const DeleteUserById = async (_id: string): Promise<boolean> => {
    try {
        const existingUser = await findUserById(_id);
        if (!existingUser) return false;

        await Promise.all([
            User.findByIdAndDelete({ _id }),
            removeUserIdFromAllClass(_id, existingUser.role, existingUser.classes, existingUser.assignedClasses),
            checkStudentAndDeleteAttendance(existingUser)
        ])
        return true;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const addToAssignClasses = async (teachers: string[], classId: string): Promise<void> => {
    try {

        await User.updateMany(
            {
                _id: { $in: teachers },
                role: { $in: [roles.teacher, roles.admin] },
            },
            {
                $addToSet: { assignedClasses: classId },
            }
        );
        return;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const addToClasses = async (students: string[], classId: string): Promise<void> => {
    try {
        await User.updateMany(
            {
                _id: { $in: students },
                role: roles.student,
            },
            {
                $addToSet: { classes: classId },
            }
        );
        return;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const findUsersInClass = async (userIds: string[]): Promise<UserToShowInClass[]> => {
    try {
        const users = (await User.find({ _id: { $in: userIds } }).lean()).map(convertUserToUseInClassData);
        return users;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
};

export const removeIdFromAssignClasses = async (teachers: string[], classId: string): Promise<void> => {
    try {

        await User.updateMany(
            {
                _id: { $in: teachers },
                role: { $in: [roles.teacher, roles.admin] },
            },
            {
                $pull: { assignedClasses: classId },
            }
        );
        return;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const removeIdFromClasses = async (students: string[], classId: string): Promise<void> => {
    try {
        await User.updateMany(
            {
                _id: { $in: students },
                role: roles.student,
            },
            {
                $pull: { classes: classId },
            }
        );
        return;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message);
    }
}

export const fetchUsersClassData = async (userData: UserWithoutSensitiveData[]): Promise<UserWithClassData[]> => {
    try {
        return await Promise.all(
            userData.map(async (user) => {
                let assignedClasses;
                let classes;
                if (user.assignedClasses) {
                    assignedClasses = await findClassNameByIds(user.assignedClasses);
                }
                if (user.classes) {
                    classes = await findClassNameByIds(user.classes)
                }
                return {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    assignedClasses,
                    classes
                }
            }
            )
        )
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message)
    }
}