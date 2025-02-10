/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../config";
import { AuthenticationError } from "../errors";
import { logger } from "../utils/logger";
import { customRequestWithPayload, TokenPayload } from "../interfaces";
import { checkRefreshTokenExistsById, checkTokenBlacklist } from "../services";
import { isValidObjectId } from "../utils/objectIdValidator";



export const accessTokenAuth = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const AccessToken = req.headers.authorization?.split(' ')[1];
        if (!AccessToken) return next(new AuthenticationError());

        const isJwtBlacklisted = await checkTokenBlacklist(AccessToken);
        if (isJwtBlacklisted) return next(new AuthenticationError());

        const tokenPayload: TokenPayload = await verifyAccessToken(AccessToken);
        const { id } = tokenPayload;
        
        const isValidId = isValidObjectId(id);
        if (!isValidId) return next(new AuthenticationError());

        req.payload = {
            id
        }
        next();

    } catch (error: any) {
        logger.error(error);
        next(new AuthenticationError());
    }
}

export const refreshTokenAuth = async (req: customRequestWithPayload, res: Response, next: NextFunction) => {
    try {
        const RefreshToken = req.headers.authorization?.split(' ')[1];
        if (!RefreshToken) return next(new AuthenticationError());

        const isJwtBlacklisted = await checkTokenBlacklist(RefreshToken);
        if (isJwtBlacklisted) return next(new AuthenticationError());

        const tokenPayload = await verifyRefreshToken(RefreshToken);

        const isRefreshTokenExists = await checkRefreshTokenExistsById(tokenPayload.id, RefreshToken);
        if (!isRefreshTokenExists) return next(new AuthenticationError());

        req.payload = { id: tokenPayload.id };
        next();
    } catch (error: any) {
        logger.error(error);
        next(new AuthenticationError());
    }
};