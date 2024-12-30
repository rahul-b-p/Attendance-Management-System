"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const class_schema_1 = require("../schemas/class.schema");
const controllers_1 = require("../controllers");
exports.router = (0, express_1.Router)();
// create class
exports.router.post('/', (0, middlewares_1.validateReqBody)(class_schema_1.CreateClassSchema), controllers_1.classController.createClass);
