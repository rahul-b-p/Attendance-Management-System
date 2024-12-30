import { Types } from "mongoose";
import { roles } from "../enums";
import { User } from "../models";
import { logger } from "../utils/logger";
import { CreateUserBody, UpdateUserBody, UserToUse, UserWithoutSensitiveData } from "../types";
import { getEncryptedPassword } from "../config";



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
        const user = await User.findById({ _id }).lean() as UserToUse
        return user;
    } catch (error: any) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}

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
        const { username, password, email, classes, assignedClasses, role } = user
        const hashPassword = await getEncryptedPassword(password)
        const newUser = new User({
            username,
            email,
            hashPassword: hashPassword,
            role,
            classes,
            assignedClasses
        });
        await newUser.save();

        const { hashPassword: _, refreshToken: __, ...userWithoutSensitiveData } = newUser.toObject();
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
        return users as UserWithoutSensitiveData[]
    } catch (error: any) {
        logger.error(error)
        throw new Error(error.message)
    }
}

export const updateUserById = async (_id: string, updateUserBody: UpdateUserBody): Promise<UserWithoutSensitiveData | null> => {
    try {
        const { username, password, email, assignedClasses, classes, role } = updateUserBody;
        const existingUser = await findUserById(_id);
        if (!existingUser) return null;
        const hashPassword = password ? await getEncryptedPassword(password) : existingUser?.hashPassword
        const updatedUser = await User.findByIdAndUpdate({ _id }, {
            username: username ? username : existingUser.username,
            email: email ? email : existingUser.email,
            hashPassword,
            role: role ? role : existingUser.role,
            $push: { assignedClasses, classes }
        });
        if (!updatedUser) return null
        await updatedUser.save();
        const { hashPassword: _, refreshToken: __, ...userWithoutSensitiveData } = updatedUser.toObject();
        return userWithoutSensitiveData as UserWithoutSensitiveData;
    } catch (error: any) {
        logger.error(error);
        throw new Error(error.message)
    }
}