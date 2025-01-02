"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupByDate = void 0;
const groupByDate = (records) => {
    return records.reduce((groupedRecords, record) => {
        const { date } = record;
        if (!groupedRecords[date]) {
            groupedRecords[date] = [];
        }
        groupedRecords[date].push(record);
        return groupedRecords;
    }, {});
};
exports.groupByDate = groupByDate;
