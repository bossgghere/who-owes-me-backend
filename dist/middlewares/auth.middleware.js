"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }
        // Extract token
        const token = authHeader.substring(7);
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: 'Server misconfigured: JWT_SECRET is missing',
            });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded?.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }
        // Attach userId to request
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
exports.authMiddleware = authMiddleware;
