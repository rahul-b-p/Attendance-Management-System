"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDates = exports.getCurrentDateTime = void 0;
const enums_1 = require("../enums");
const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().split(' ')[0];
    return `${year}${month}${day}-${time}`;
};
exports.getCurrentDateTime = getCurrentDateTime;
const compareDates = (inputDate) => {
    const currentDate = new Date();
    const comparisonDate = new Date(inputDate);
    const normalizedCurrentDate = new Date(currentDate.toISOString().substring(0, 10));
    const normalizedComparisonDate = new Date(comparisonDate.toISOString().substring(0, 10));
    if (normalizedComparisonDate < normalizedCurrentDate) {
        return enums_1.DateStatus.Past;
    }
    else if (normalizedComparisonDate > normalizedCurrentDate) {
        return enums_1.DateStatus.Future;
    }
    else {
        return enums_1.DateStatus.Present;
    }
};
exports.compareDates = compareDates;
