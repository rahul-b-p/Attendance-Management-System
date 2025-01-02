export const groupByDate = <T extends { date: string }>(records: T[]): Record<string, T[]> => {
    return records.reduce<Record<string, T[]>>((groupedRecords, record) => {
        const { date } = record;
        if (!groupedRecords[date]) {
            groupedRecords[date] = [];
        }
        groupedRecords[date].push(record);
        return groupedRecords;
    }, {});
};