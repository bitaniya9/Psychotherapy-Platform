export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}

export interface ITokenGenerator {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}
