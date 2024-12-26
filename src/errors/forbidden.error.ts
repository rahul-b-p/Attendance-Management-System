import { customError } from "../utils/customError";

export class ForbiddenError extends customError {
    constructor(message?: string) {
        super(message || 'Forbidden');
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }

    StatusCode = 403;

    serialize(): { success: false, message: string } {
        return { success: false, message: this.message };
    }
}