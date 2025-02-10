/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from "express";



export interface customRequestWithPayload<
    P = {},
    resBody = {},
    reqBody = {},
    reqQuery = qs.ParsedQs,
    Local extends Record<string, any> = Record<string, any>
> extends Request<P, resBody, reqBody, reqQuery, Local> {
    payload?: {
        id: string;
    };
}