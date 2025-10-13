import { IUserRepository } from "@application/interfaces/IUserRepository";

export class LogoutUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      user.setRefreshToken(null);
      await this.userRepository.update(user);
    }
  }
}
