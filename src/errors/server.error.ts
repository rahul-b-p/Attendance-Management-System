import { customError } from "../utils/customError";

export class InternalServerError extends customError {
    constructor(message?: string) {
        super(message || 'Something went wrong');
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }

    StatusCode = 500;

    serialize(): { success: false, message: string } {
        return { success: false, message: this.message };
    }
}