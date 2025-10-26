import { Request, Response, NextFunction } from "express";
import { JWTTokenGenerator } from "../../infrastructure/security/JWTTokenGenerator";

export type Role = "PATIENT" | "THERAPIST" | "ADMIN";

const tokenGenerator = new JWTTokenGenerator();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: Role;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const bypass = process.env.AUTH_BYPASS === "true" || process.env.APPOINTMENTS_USE_INMEMORY === "true";
    if (bypass) {
      // dev bypass: immediately inject a test user and skip JWT verification entirely
      console.warn("Auth bypass is ENABLED (development only). Skipping token verification.");
      req.user = {
        id: process.env.AUTH_BYPASS_USER_ID || "dev-user-id",
        email: process.env.AUTH_BYPASS_USER_EMAIL || "dev@example.com",
        role: (process.env.AUTH_BYPASS_USER_ROLE as Role) || "PATIENT",
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.substring(7);
    const payload = tokenGenerator.verifyAccessToken(token);

    req.user = {
      id: payload.id,
      email: payload.email ?? undefined,
      role: (payload.role as Role) ?? undefined,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role as Role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};
