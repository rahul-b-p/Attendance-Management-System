"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const customError_1 = require("../utils/customError");
const ErrorHandler = (err, req, res, next) => {
    if (err instanceof customError_1.customError) {
        res.status(err.StatusCode).json(err.serialize());
    }
    else {
        res.status(400).json({
            message: 'Something bad has happend'
        });
    }
};
exports.ErrorHandler = ErrorHandler;
