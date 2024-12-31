import mongoose, { Schema } from "mongoose";
import { IBlackListToken } from "../interfaces/blacklistToken.interface";

const blacklistTokenSchema = new Schema<IBlackListToken>({
    token: {
        type: String,
        required: true,
        unique: true
    },
    expireAt: {
        type: Date,
        required: true
    },
});

blacklistTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const BlacklistToken = mongoose.model('blacklistTokens', blacklistTokenSchema);
export default BlacklistToken;