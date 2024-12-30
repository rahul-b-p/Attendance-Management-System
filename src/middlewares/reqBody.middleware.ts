import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { BadRequestError } from "../errors";
import { InternalServerError } from "../errors/server.error";



export const validateReqBody=(schema:ZodSchema)=>{
    return (req:Request, res:Response, next:NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if(error instanceof ZodError){
                error.errors.map((e)=>{
                    return next(new BadRequestError(`Bad Request, ${e.message}`))
                })
            }
            else next(new InternalServerError('Validation failed'));
        }
    };
}