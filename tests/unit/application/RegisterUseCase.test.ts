import { RegisterUseCase } from "@application/use-cases/auth/RegisterUseCase";
import { Role } from "@prisma/client";

// Mock dependencies
const mockUserRepo = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
const mockPasswordHasher = { hash: jest.fn() };
const mockTokenGenerator = {
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
};
const mockOtpGenerator = { generateToken: jest.fn() };
const mockEmailService = { sendVerificationEmail: jest.fn() };

const useCase = new RegisterUseCase(
  mockUserRepo as any,
  mockPasswordHasher as any,
  mockTokenGenerator as any,
  mockOtpGenerator as any,
  mockEmailService as any
);

// jest hooks
// beforeEach - after each it function
// beforeAll - run once
// afterEach
// afterAll -

describe("RegisterUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register user successfully", async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue("hashedPassword");
    mockOtpGenerator.generateToken.mockReturnValue("otpToken");
    const mockUser = {
      id: "1",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      role: Role.PATIENT,
      toJSON: jest.fn().mockReturnValue({ id: "1", email: "test@example.com" }),
      setEmailVerificationToken: jest.fn(),
      setRefreshToken: jest.fn(),
    };
    mockUserRepo.create.mockResolvedValue(mockUser);
    mockTokenGenerator.generateAccessToken.mockReturnValue("accessToken");
    mockTokenGenerator.generateRefreshToken.mockReturnValue("refreshToken");

    const result = await useCase.execute({
      email: "test@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      role: Role.PATIENT,
    });

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith("password");
    expect(mockUserRepo.create).toHaveBeenCalled();
    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalled();
    expect(result).toHaveProperty("accessToken", "accessToken");
    expect(result).toHaveProperty("refreshToken", "refreshToken");
  });

  it("should throw if user exists", async () => {
    mockUserRepo.findByEmail.mockResolvedValue({});

    await expect(
      useCase.execute({
        email: "test@example.com",
        password: "password",
        firstName: "John",
        lastName: "Doe",
        role: Role.PATIENT,
      })
    ).rejects.toThrow("User with this email already exists");
  });
});
