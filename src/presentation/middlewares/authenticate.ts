import { Request, Response, NextFunction } from "express";
import { JWTTokenGenerator } from "../../infrastructure/security/JWTTokenGenerator";
import { Role } from "@prisma/client";

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
