import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces";
import { roles } from "../enums";


const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    hashPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(roles)
    },
    refreshToken: {
        type: String,
        required: false
    },
    assignedClasses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "classes", 
        },
    ],
    classes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "classes",
        } 
    ]
});


const User = mongoose.model('users', userSchema);
export default User;

