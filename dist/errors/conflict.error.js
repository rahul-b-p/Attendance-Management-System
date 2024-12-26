"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const customError_1 = require("../utils/customError");
class ConflictError extends customError_1.customError {
    constructor(message) {
        super(message || 'Conflict');
        this.StatusCode = 409;
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
    serialize() {
        return { success: false, message: this.message };
    }
}
exports.ConflictError = ConflictError;
