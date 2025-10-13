export interface IOTPGenerator {
  generateOTP(length: number): string;
  generateToken(): string; // For verification tokens
}
