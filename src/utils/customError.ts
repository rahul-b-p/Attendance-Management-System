export abstract class customError extends Error {
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, customError.prototype);
    }

    abstract StatusCode: number;
    abstract serialize(): { success: false, message: string };
}