import { NextFunction, Request, Response } from "express";



export const setResponseHeaders = (req:Request, res:Response, next:NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Powered-By', 'Rahul B P');
    next();
};