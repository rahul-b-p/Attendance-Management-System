import mongoose, { Schema } from "mongoose";
import { IClass } from "../interfaces";


const classSchema = new Schema<IClass>({
    className: {
        type: String,
        required: true
    },
    teachers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
});


const Class = mongoose.model('classes', classSchema);
export default Class;