import { Document, Types } from "mongoose";

export interface IBlackListToken extends Document {
    _id: Types.ObjectId;
    token: string;
    expireAt: Date;
};
