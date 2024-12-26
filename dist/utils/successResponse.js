"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessResponse = void 0;
const sendSuccessResponse = (message, data) => {
    return new Promise((resolve) => {
        resolve(Object.assign({ success: true, message }, (data !== undefined && { data })));
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
