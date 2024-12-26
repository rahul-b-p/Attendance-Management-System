import { customError } from "../utils/customError";

export class ConflictError extends customError {
    constructor(message?: string) {
        super(message || 'Conflict');
        Object.setPrototypeOf(this, ConflictError.prototype);
    }

    StatusCode = 409;

    serialize(): { success: false, message: string } {
        return { success: false, message: this.message };
    }
}