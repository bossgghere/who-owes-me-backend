"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoURI = process.env.MONGO_URI;
const connectDB = async () => {
    if (!mongoURI) {
        console.warn("⚠️ MONGO_URI not set, skipping DB connection");
        return;
    }
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection failed", error);
    }
};
exports.default = connectDB;
