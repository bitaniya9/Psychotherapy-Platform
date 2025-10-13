import { User } from "@domain/entities/User";
import { IUserRepository } from "@application/interfaces/IUserRepository";
import { IPasswordHasher } from "@application/interfaces/IPasswordHasher";
import { ITokenGenerator } from "@application/interfaces/ITokenGenerator";
import { IOTPGenerator } from "@application/interfaces/IOTPGenerator";
import { IEmailService } from "@application/interfaces/IEmailService";
import { Role } from "@prisma/client";

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenGenerator: ITokenGenerator,
    private otpGenerator: IOTPGenerator,
    private emailService: IEmailService
  ) {}

  async execute(dto: RegisterDTO) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // Generate email verification OTP (6 digits) and expiry (10 minutes)
    // Support generators that provide generateOTP(length) or generateToken()
    let verificationToken: string;
    if (typeof (this.otpGenerator as any).generateOTP === "function") {
      verificationToken = (this.otpGenerator as any).generateOTP(6);
    } else {
      verificationToken = (this.otpGenerator as any).generateToken();
    }
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    });

    // Set verification token
    user.setEmailVerificationToken(verificationToken, verificationExpiry);
    await this.userRepository.update(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.firstName
    );

    // Generate tokens
    const accessToken = this.tokenGenerator.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.tokenGenerator.generateRefreshToken({
      id: user.id,
    });

    // Save refresh token
    user.setRefreshToken(refreshToken);
    await this.userRepository.update(user);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }
}
