import { z } from "zod";
import { Status } from "../enums";

export const StatusSchema = z.nativeEnum(Status, { message:"status is required, and should be 'present' or 'absent' or 'absent'"});
