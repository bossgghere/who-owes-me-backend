import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById } from './auth.service';

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};

const getStatusCode = (err: any, fallback: number) => {
  const code = err?.statusCode;
  return typeof code === 'number' ? code : fallback;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = (req.body ?? {}) as Record<string, unknown>;

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

    const user = await registerUser(normalizedEmail, normalizedPassword);

    res.status(201).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    res.status(getStatusCode(error, 400)).json({
      success: false,
      message: getErrorMessage(error, 'Registration failed'),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = (req.body ?? {}) as Record<string, unknown>;

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

    const result = await loginUser(normalizedEmail, normalizedPassword);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(getStatusCode(error, 401)).json({
      success: false,
      message: getErrorMessage(error, 'Login failed'),
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await getUserById(userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    res.status(getStatusCode(error, 401)).json({
      success: false,
      message: getErrorMessage(error, 'Failed to get user'),
    });
  }
};
