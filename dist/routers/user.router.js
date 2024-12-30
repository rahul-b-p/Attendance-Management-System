"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const enums_1 = require("../enums");
const schemas_1 = require("../schemas");
const controllers_1 = require("../controllers");
exports.router = (0, express_1.Router)();
// create user
exports.router.post('/:role', (0, middlewares_1.validateRole)(enums_1.roles.admin, enums_1.roles.teacher), (0, middlewares_1.validateReqBody)(schemas_1.CreateUserSchema), controllers_1.userController.createUser);
// read users
exports.router.get('/:role', (0, middlewares_1.validateRole)(enums_1.roles.admin, enums_1.roles.teacher), controllers_1.userController.readUser);
// update user
exports.router.put('/:id', (0, middlewares_1.validateRole)(enums_1.roles.admin, enums_1.roles.teacher), (0, middlewares_1.validateReqBody)(schemas_1.updatedUserSchema), controllers_1.userController.updateUser);
// delete user
exports.router.delete('/:id', (0, middlewares_1.validateRole)(enums_1.roles.admin, enums_1.roles.student), controllers_1.userController.deleteUser);
