import { DateStatus } from "../enums";

export const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = now.toTimeString().split(' ')[0];
    return `${year}${month}${day}-${time}`;
};


export const compareDates = (inputDate: string): DateStatus => {

    const currentDate = new Date();
    const comparisonDate = new Date(inputDate);

    const normalizedCurrentDate = new Date(currentDate.toISOString().substring(0, 10));
    const normalizedComparisonDate = new Date(comparisonDate.toISOString().substring(0, 10));

    if (normalizedComparisonDate < normalizedCurrentDate) {
        return DateStatus.Past;
    } else if (normalizedComparisonDate > normalizedCurrentDate) {
        return DateStatus.Future;
    } else {
        return DateStatus.Present;
    }
}


