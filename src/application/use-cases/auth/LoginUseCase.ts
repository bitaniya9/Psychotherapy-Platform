import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { IPasswordHasher } from "../../interfaces/IPasswordHasher";
import { ITokenGenerator } from "../../interfaces/ITokenGenerator";
import { UnauthorizedError } from "../../../domain/exceptions/AppError";

export interface LoginDTO {
  email: string;
  password: string;
}
// this thing where was implemented
// on Service
export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenGenerator: ITokenGenerator
  ) {}

  async execute(
    dto: LoginDTO
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError("Email not verified");
    }

    const accessToken = this.tokenGenerator.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = this.tokenGenerator.generateRefreshToken({
      id: user.id,
    });

    user.setRefreshToken(refreshToken);
    await this.userRepository.update(user);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }
}
