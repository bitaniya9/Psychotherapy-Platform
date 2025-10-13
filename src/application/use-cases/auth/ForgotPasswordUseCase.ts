import { IUserRepository } from "../../interfaces/IUserRepository";
import { IOTPGenerator } from "../../interfaces/IOTPGenerator";
import { IEmailService } from "../../interfaces/IEmailService";
import { NotFoundError } from "../../../domain/exceptions/AppError";

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpGenerator: IOTPGenerator,
    private emailService: IEmailService
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const otp = this.otpGenerator.generateOTP(6);
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.setPasswordResetToken(otp, expiry);
    await this.userRepository.update(user);

    await this.emailService.sendPasswordResetEmail(
      user.email,
      otp,
      user.firstName
    );
  }
}
