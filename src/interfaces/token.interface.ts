import { JwtPayload } from "jsonwebtoken";
import { roles } from "../enums";



export interface TokenPayload extends JwtPayload {
    id: string;
    role: roles;
    iat: number;
    exp: number;
}