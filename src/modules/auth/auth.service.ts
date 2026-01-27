import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './auth.model';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const registerUser = async (email: string, password: string) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
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

export const loginUser = async (email: string, password: string) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
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

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id,
    email: user.email,
    createdAt: user.createdAt,
  };
};
