"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = __importDefault(require("./auth.model"));
class AuthServiceError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'AuthServiceError';
        this.statusCode = statusCode;
    }
}
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AuthServiceError('Server misconfigured: JWT_SECRET is missing', 500);
    }
    return secret;
};
const normalizeEmail = (email) => email.trim().toLowerCase();
const registerUser = async (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    // Check if user already exists
    const existingUser = await auth_model_1.default.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new AuthServiceError('Email already registered', 409);
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    try {
        // Create user
        const user = await auth_model_1.default.create({
            email: normalizedEmail,
            password: hashedPassword,
        });
        return {
            id: user._id.toString(),
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    catch (err) {
        // Handle duplicate key race condition
        if (err?.code === 11000) {
            throw new AuthServiceError('Email already registered', 409);
        }
        throw err;
    }
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    // Find user
    const user = await auth_model_1.default.findOne({ email: normalizedEmail });
    if (!user) {
        throw new AuthServiceError('Invalid email or password', 401);
    }
    // Compare password
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AuthServiceError('Invalid email or password', 401);
    }
    // Generate JWT
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, getJwtSecret(), {
        expiresIn: '7d',
    });
    return {
        token,
        user: {
            id: user._id.toString(),
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
    };
};
exports.loginUser = loginUser;
const getUserById = async (userId) => {
    const user = await auth_model_1.default.findById(userId).select('-password');
    if (!user) {
        throw new AuthServiceError('User not found', 404);
    }
    return {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.getUserById = getUserById;
