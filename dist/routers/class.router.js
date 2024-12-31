"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const schemas_1 = require("../schemas");
const controllers_1 = require("../controllers");
const enums_1 = require("../enums");
exports.router = (0, express_1.Router)();
// create class
exports.router.post('/', (0, middlewares_1.validateRole)(enums_1.roles.admin), (0, middlewares_1.validateReqBody)(schemas_1.CreateClassSchema), controllers_1.classController.createClass);
// read all class
exports.router.get('/', (0, middlewares_1.validateRole)(enums_1.roles.admin), controllers_1.classController.readAllClasses);
// assign teacher to class
exports.router.put('/:classId/assign-teacher', (0, middlewares_1.validateRole)(enums_1.roles.admin), (0, middlewares_1.validateReqBody)(schemas_1.assignTeacherSchema), controllers_1.classController.assignClass);
