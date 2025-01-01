import { z } from "zod";
import { YYYYMMDDregex } from "../utils/regex";



export const YYYYMMDDSchema = z.string({message:"Attendance recording date is Required"}).regex(
    YYYYMMDDregex,
    "Date must be in YYYYMMDD format and valid"
);
