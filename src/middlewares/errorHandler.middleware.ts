import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { customError } from "../utils/customError";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ErrorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof customError) {
        res.status(err.StatusCode).json(err.serialize());
    }
    else {
        res.status(400).json({
            message: 'Something bad has happend'
        });
    }
}