import { z } from "zod";
import { YYYYMMDDregex } from "../utils/regex";




export const YYYYMMDDSchema = z.string({
    message: "Attendance recording date is required",
}).regex(
    YYYYMMDDregex,
    "Date must be in YYYY-MM-DD format"
).refine((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);

    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}, "Invalid date").transform((dateStr) => {
    return dateStr;
});
