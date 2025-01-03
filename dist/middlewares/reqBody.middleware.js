"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReqBody = void 0;
const zod_1 = require("zod");
const errors_1 = require("../errors");
const server_error_1 = require("../errors/server.error");
const validateReqBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                error.errors.map((e) => {
                    return next(new errors_1.BadRequestError(`Bad Request, ${e.message}`));
                });
            }
            else
                next(new server_error_1.InternalServerError('Validation failed'));
        }
    };
};
exports.validateReqBody = validateReqBody;
