"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = __importDefault(require("./auth.model"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const registerUser = async (email, password) => {
    // Check if user already exists
    const existingUser = await auth_model_1.default.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Create user
    const user = await auth_model_1.default.create({
        email,
        password: hashedPassword,
    });
    // Generate JWT
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '7d',
    });
    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            createdAt: user.createdAt,
        },
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    // Find user
    const user = await auth_model_1.default.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    // Compare password
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    // Generate JWT
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '7d',
    });
    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            createdAt: user.createdAt,
        },
    };
};
exports.loginUser = loginUser;
const getUserById = async (userId) => {
    const user = await auth_model_1.default.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
    };
};
exports.getUserById = getUserById;
