import { customError } from "../utils/customError";

export class NotFoundError extends customError {
    constructor(message?: string) {
        super(message || 'Not Found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    StatusCode = 404;

    serialize(): { success: false, message: string } {
        return { success: false, message: this.message };
    }
}