"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }
        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }
        const result = await (0, auth_service_1.registerUser)(email, password);
        res.status(201).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Registration failed',
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }
        const result = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || 'Login failed',
        });
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }
        const user = await (0, auth_service_1.getUserById)(userId);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || 'Failed to get user',
        });
    }
};
exports.me = me;
