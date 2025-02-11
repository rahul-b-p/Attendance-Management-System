"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReqQuery = exports.validateReqBody = void 0;
const zod_1 = require("zod");
const errors_1 = require("../errors");
const server_error_1 = require("../errors/server.error");
const logger_1 = require("../utils/logger");
const validateReqBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                error.errors.map((e) => {
                    logger_1.logger.error(error);
                    return next(new errors_1.BadRequestError(`Bad Request, ${e.message}`));
                });
            }
            else
                next(new server_error_1.InternalServerError('Validation failed'));
        }
    };
};
exports.validateReqBody = validateReqBody;
const validateReqQuery = (schema) => {
    return (req, res, next) => {
        try {
            req.query = schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                error.errors.map((e) => {
                    return next(new errors_1.BadRequestError(`Bad Request, Invalid Query`));
                });
            }
            else
                next(new server_error_1.InternalServerError('Validation failed'));
        }
    };
};
exports.validateReqQuery = validateReqQuery;
