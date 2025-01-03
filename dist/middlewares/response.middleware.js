"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setResponseHeaders = void 0;
const setResponseHeaders = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Powered-By', 'Rahul B P');
    next();
};
exports.setResponseHeaders = setResponseHeaders;
