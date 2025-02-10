import jwt from 'jsonwebtoken';
import { TokenPayload } from '../interfaces';
import { logger } from '../utils/logger';
import { BlacklistToken } from '../models';



export const blackListToken = async (token: string):Promise<void>=> {
    try {
        const { exp } = jwt.decode(token) as TokenPayload;
        const expireAt = new Date(exp * 1000);
        const blacklistedToken = new BlacklistToken({ token, expireAt });
        await blacklistedToken.save();
        return;
    } catch (error) {
        logger.error(error);
        throw new Error("Can't Blacklist Token due to an error");
    }
}

export const checkTokenBlacklist = async (token: string):Promise<boolean> => {
    try {
        const isJwtBlacklisted = await BlacklistToken.findOne({token});
        return isJwtBlacklisted?true:false;
    } catch (error) {
        logger.error(error);
        throw new Error("Can't check the token now");
    }
}
