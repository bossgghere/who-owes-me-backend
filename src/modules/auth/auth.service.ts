import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './auth.model';

class AuthServiceError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
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

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const registerUser = async (email: string, password: string) => {
  const normalizedEmail = normalizeEmail(email);

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new AuthServiceError('Email already registered', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create user
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (err: any) {
    // Handle duplicate key race condition
    if (err?.code === 11000) {
      throw new AuthServiceError('Email already registered', 409);
    }
    throw err;
  }
};

export const loginUser = async (email: string, password: string) => {
  const normalizedEmail = normalizeEmail(email);

  // Find user
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new AuthServiceError('Invalid email or password', 401);
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthServiceError('Invalid email or password', 401);
  }

  // Generate JWT
  const token = jwt.sign({ userId: user._id.toString() }, getJwtSecret(), {
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

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
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
