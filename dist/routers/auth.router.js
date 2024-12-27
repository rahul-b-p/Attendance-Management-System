"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const schemas_1 = require("../schemas");
const controllers_1 = require("../controllers");
exports.router = (0, express_1.Router)();
exports.router.post('/login', (0, middlewares_1.validateReqBody)(schemas_1.loginSchema), controllers_1.authController.login);
