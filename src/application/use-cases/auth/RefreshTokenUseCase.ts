import { IUserRepository } from "@application/interfaces/IUserRepository";
import { ITokenGenerator } from "@application/interfaces/ITokenGenerator";

export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tokenGenerator: ITokenGenerator
  ) {}

  async execute(refreshToken: string) {
    // Verify refresh token
    let payload;
    try {
      payload = this.tokenGenerator.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }

    // Find user by id from payload
    const user = await this.userRepository.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    // Generate new tokens
    const newAccessToken = this.tokenGenerator.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = this.tokenGenerator.generateRefreshToken({
      id: user.id,
    });

    // Update refresh token in database
    user.setRefreshToken(newRefreshToken);
    await this.userRepository.update(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
