"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
const customError_1 = require("../utils/customError");
class ForbiddenError extends customError_1.customError {
    constructor(message) {
        super(message || 'Forbidden');
        this.StatusCode = 403;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    serialize() {
        return { success: false, message: this.message };
    }
}
exports.ForbiddenError = ForbiddenError;
