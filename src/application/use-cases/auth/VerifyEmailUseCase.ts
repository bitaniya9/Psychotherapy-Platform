import { IUserRepository } from "../../interfaces/IUserRepository";
import { IEmailService } from "../../interfaces/IEmailService";
import {
  NotFoundError,
  ValidationError,
} from "../../../domain/exceptions/AppError";

export class VerifyEmailUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}
  /**
   * Verify a user's email using their email and the OTP sent to them.
   * Requiring email + otp avoids ambiguous OTP collisions and follows explicit verification.
   */
  async execute(email: string, otp: string): Promise<void> {
    if (!email || !otp) {
      throw new ValidationError("Email and OTP are required");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // OTP must match the one stored for the user
    if (!user.emailVerificationToken || user.emailVerificationToken !== otp) {
      throw new NotFoundError("Invalid verification code");
    }

    if (!user.isEmailVerificationTokenValid()) {
      throw new ValidationError("Verification code expired");
    }

    user.verifyEmail();
    await this.userRepository.update(user);

    // Optional: Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.firstName);
  }
}
