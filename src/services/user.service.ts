import { roles } from "../enums";
import { User } from "../models";
import { logger } from "../utils/logger";



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