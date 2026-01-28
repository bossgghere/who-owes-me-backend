"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const getErrorMessage = (err, fallback) => {
    if (err instanceof Error && err.message)
        return err.message;
    return fallback;
};
const getStatusCode = (err, fallback) => {
    const code = err?.statusCode;
    return typeof code === 'number' ? code : fallback;
};
const register = async (req, res) => {
    try {
        const { email, password } = (req.body ?? {});
        // Validate input
        if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();
        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }
        if (normalizedPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }
        const user = await (0, auth_service_1.registerUser)(normalizedEmail, normalizedPassword);
        res.status(201).json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        res.status(getStatusCode(error, 400)).json({
            success: false,
            message: getErrorMessage(error, 'Registration failed'),
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = (req.body ?? {});
        // Validate input
        if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();
        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }
        const result = await (0, auth_service_1.loginUser)(normalizedEmail, normalizedPassword);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(getStatusCode(error, 401)).json({
            success: false,
            message: getErrorMessage(error, 'Login failed'),
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
            data: { user },
        });
    }
    catch (error) {
        res.status(getStatusCode(error, 401)).json({
            success: false,
            message: getErrorMessage(error, 'Failed to get user'),
        });
    }
};
exports.me = me;
