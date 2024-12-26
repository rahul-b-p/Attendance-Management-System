import { customError } from "../utils/customError";

export class BadRequestError extends customError {
    constructor(message?: string) {
        super(message || 'Bad Request');
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    StatusCode = 400;

    serialize(): { success: false, message: string } {
        return { success: false, message: this.message };
    }
}