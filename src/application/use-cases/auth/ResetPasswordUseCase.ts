import { IUserRepository } from "../../interfaces/IUserRepository";
import { IPasswordHasher } from "../../interfaces/IPasswordHasher";
import {
  NotFoundError,
  ValidationError,
} from "../../../domain/exceptions/AppError";

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByPasswordResetToken(dto.token);
    if (!user) {
      throw new NotFoundError("Invalid reset token");
    }

    if (!user.isPasswordResetTokenValid()) {
      throw new ValidationError("Reset token expired");
    }

    const hashedPassword = await this.passwordHasher.hash(dto.newPassword);
    user.updatePassword(hashedPassword);
    user.clearPasswordResetToken();
    await this.userRepository.update(user);
  }
}
