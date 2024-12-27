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