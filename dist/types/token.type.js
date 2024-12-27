"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roles_type_1 = require("./roles.type");
jsonwebtoken_1.JwtPayload = {
    id: string,
    role: roles_type_1.roles,
    iat: number,
    exp: number
};
