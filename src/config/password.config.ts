import bcrypt from 'bcrypt'
import { logger } from '../utils/logger';

export const getEncryptedPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const encryptedPassword: string = await bcrypt.hash(password, salt)
        return encryptedPassword;
    } catch (error) {
        logger.error(error);
        throw new Error("An Error occur while password encryption");
    }
}

export const verifyPassword = async (password: string, hashPass: string): Promise<boolean> => {
    try {
        const isVerifiedPassword = await bcrypt.compare(password, hashPass);
        return isVerifiedPassword;
    } catch (error) {
        logger.error(error);
        throw new Error("An Error occur while password verification");
    }
}