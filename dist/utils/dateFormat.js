"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDateTime = void 0;
const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().split(' ')[0];
    return `${year}${month}${day}-${time}`;
};
exports.getCurrentDateTime = getCurrentDateTime;
