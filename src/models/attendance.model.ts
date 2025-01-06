import mongoose, { Schema } from "mongoose";
import { IAttendance } from "../interfaces";
import { Status } from "../enums";
import { getCurrentDateTime } from "../utils/dateUtils";


const attendanceSchema = new Schema<IAttendance>({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: true
    },
    date: {
        type: String,
        required: true,
        match: /^2[0-1][0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(Status)
    },
    remarks: {
        type: String,
        required: false
    },
    createAt: {
        type: String,
        default: getCurrentDateTime()
    }
});


const Attendance = mongoose.model('attendances', attendanceSchema);
export default Attendance;
