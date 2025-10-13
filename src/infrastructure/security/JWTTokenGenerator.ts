import jwt from "jsonwebtoken";
import {
  ITokenGenerator,
  TokenPayload,
} from "../../application/interfaces/ITokenGenerator";
import { UnauthorizedError } from "../../domain/exceptions/AppError";

export class JWTTokenGenerator implements ITokenGenerator {
  private accessSecret = process.env.JWT_ACCESS_SECRET!;
  private refreshSecret = process.env.JWT_REFRESH_SECRET!;
  private accessExpiry = process.env.JWT_ACCESS_EXPIRY!;
  private refreshExpiry = process.env.JWT_REFRESH_EXPIRY!;

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiry,
    } as any);
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshExpiry,
    } as any);
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.accessSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError("Invalid access token");
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as TokenPayload;
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }
  }
}
