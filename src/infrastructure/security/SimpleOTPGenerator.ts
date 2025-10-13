import crypto from "crypto";
import { IOTPGenerator } from "@application/interfaces/IOTPGenerator";

export class SimpleOTPGenerator implements IOTPGenerator {
  generateOTP(length: number): string {
    // generate numeric OTP of specified length
    let otp = "";
    while (otp.length < length) {
      const digit = Math.floor(Math.random() * 10);
      otp += String(digit);
    }
    return otp;
  }

  generateToken(): string {
    // fallback token generator (UUID)
    return crypto.randomUUID();
  }
}
