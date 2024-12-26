"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const customError_1 = require("../utils/customError");
class NotFoundError extends customError_1.customError {
    constructor(message) {
        super(message || 'Not Found');
        this.StatusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serialize() {
        return { success: false, message: this.message };
    }
}
exports.NotFoundError = NotFoundError;
