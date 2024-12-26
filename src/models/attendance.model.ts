import mongoose, { Schema } from "mongoose";
import { IAttendance } from "../interfaces";
import { status } from "../enums";


const attendanceSchema = new Schema<IAttendance>({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
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
        enum: Object.values(status)
    },
    remarks: {
        type: String,
        required: true
    },
    createAt: {
        type: Number,
        default: Date.now()
    }
});


const Attendance = mongoose.model('attendances', attendanceSchema);
export default Attendance;
