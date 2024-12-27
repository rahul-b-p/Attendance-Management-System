import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { AuthenticationError, InternalServerError, NotFoundError } from "../errors";
import { signAccessToken, signRefreshToken, verifyPassword } from "../config";
import { sendSuccessResponse } from "../utils/successResponse";
import { LoginBody } from "../types";
import { findUserByEmail, updateRefreshToken } from "../services";




export const login = async (req: Request<{}, any, LoginBody>, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (!existingUser) return next(new NotFoundError('User not found with given email id'));

        const isVerifiedPassword = await verifyPassword(password, existingUser.hashPassword);
        if (!isVerifiedPassword) return next(new AuthenticationError('Invalid Password'));

        const AccessToken = await signAccessToken(existingUser._id.toString(), existingUser.role);
        const RefreshToken = await signRefreshToken(existingUser._id.toString(), existingUser.role);

        await updateRefreshToken(existingUser._id, RefreshToken)

        res.statusMessage = "Login Successful"
        res.status(200).json(await sendSuccessResponse('Login Successful', { AccessToken, RefreshToken }));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError())
    }
}