/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { AuthenticationError, InternalServerError, NotFoundError } from "../errors";
import { signAccessToken, signRefreshToken, verifyPassword } from "../config";
import { sendSuccessResponse } from "../utils/successResponse";
import { LoginBody } from "../types";
import { blackListToken, deleteRefreshToken, findUserByEmail, findUserById, updateRefreshToken } from "../services";
import { customRequestWithPayload } from "../interfaces";




export const login = async (req: Request<{}, any, LoginBody>, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (!existingUser) return next(new NotFoundError('User not found with given email id'));

        const isVerifiedPassword = await verifyPassword(password, existingUser.hashPassword);
        if (!isVerifiedPassword) return next(new AuthenticationError('Invalid Password'));

        const AccessToken = await signAccessToken(existingUser._id.toString(), existingUser.role);
        const RefreshToken = await signRefreshToken(existingUser._id.toString(), existingUser.role);

        await updateRefreshToken(existingUser._id, RefreshToken);

        res.statusMessage = "Login Successful";
        res.status(200).json(await sendSuccessResponse('Login Successful', { AccessToken, RefreshToken }));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError())
    }
}

export const refreshToken = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const id = req.payload?.id;
        if (!id) throw new Error('The user ID was not added to the payload by the authentication middleware.');

        const existingUser = await findUserById(id);
        if (!existingUser) return next(new NotFoundError());

        const AccessToken = await signAccessToken(existingUser._id.toString(), existingUser.role);
        const RefreshToken = await signRefreshToken(existingUser._id.toString(), existingUser.role);

        await updateRefreshToken(existingUser._id, RefreshToken);

        res.status(200).json(await sendSuccessResponse('Token refreshed successfully', { AccessToken, RefreshToken }));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}

export const logout = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const id = req.payload?.id;
        if (!id) throw new Error('The user ID was not added to the payload by the authentication middleware.');

        const AccessToken = req.headers.authorization?.split(' ')[1];
        if (!AccessToken) throw new Error('AccessToken missed from header after auth middleware');

        const existingUser = await findUserById(id);
        if (!existingUser) return next(new NotFoundError());

        await blackListToken(AccessToken);
        if (existingUser.refreshToken) {
            await blackListToken(existingUser.refreshToken);
            await deleteRefreshToken(existingUser._id, existingUser.refreshToken);
        }

        res.status(200).json(await sendSuccessResponse('Logged out successfully.'));
    } catch (error) {
        logger.error(error);
        next(new InternalServerError('Something went wrong'));
    }
}
