"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const customError_1 = require("../utils/customError");
class InternalServerError extends customError_1.customError {
    constructor(message) {
        super(message || 'Something went wrong');
        this.StatusCode = 500;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
    serialize() {
        return { success: false, message: this.message };
    }
}
exports.InternalServerError = InternalServerError;
