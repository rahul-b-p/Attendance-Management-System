"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRegex = exports.objectIdRegex = void 0;
exports.objectIdRegex = /^[a-fA-F0-9]{24}$/;
exports.emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
