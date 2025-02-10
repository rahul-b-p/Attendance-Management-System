/* eslint-disable @typescript-eslint/no-explicit-any */
export const sendSuccessResponse = (message: string, data?: any): Promise<any> => {
    return new Promise((resolve) => {
        resolve({
            success: true,
            message,
            ...(data !== undefined && { data }),
        });
    });
};
