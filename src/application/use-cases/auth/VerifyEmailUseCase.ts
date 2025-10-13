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

  async execute(token: string): Promise<void> {
    // token here is actually an OTP
    const user = await this.userRepository.findByEmailVerificationToken(token);
    if (!user) {
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
