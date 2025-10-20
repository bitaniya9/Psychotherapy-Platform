import { RefreshTokenUseCase } from "../../../src/application/use-cases/auth/RefreshTokenUseCase";
type Role = "PATIENT" | "THERAPIST" | "ADMIN";

// Mock dependencies
const mockUserRepo = {
  findById: jest.fn(),
  update: jest.fn(),
};
const mockTokenGenerator = {
  verifyRefreshToken: jest.fn(),
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
};

const useCase = new RefreshTokenUseCase(
  mockUserRepo as any,
  mockTokenGenerator as any
);

describe("RefreshTokenUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should refresh tokens successfully", async () => {
  const payload = { id: "1", email: "test@example.com", role: "PATIENT" as Role };
    mockTokenGenerator.verifyRefreshToken.mockReturnValue(payload);
    const mockUser = {
      id: "1",
      email: "test@example.com",
      role: "PATIENT" as Role,
      refreshToken: "oldRefreshToken",
      setRefreshToken: jest.fn(),
    };
    mockUserRepo.findById.mockResolvedValue(mockUser);
    mockTokenGenerator.generateAccessToken.mockReturnValue("newAccessToken");
    mockTokenGenerator.generateRefreshToken.mockReturnValue("newRefreshToken");

    const result = await useCase.execute("oldRefreshToken");

    expect(mockTokenGenerator.verifyRefreshToken).toHaveBeenCalledWith(
      "oldRefreshToken"
    );
    expect(mockUserRepo.findById).toHaveBeenCalledWith("1");
    expect(mockTokenGenerator.generateAccessToken).toHaveBeenCalledWith({
  id: "1",
  email: "test@example.com",
  role: "PATIENT" as Role,
    });
    expect(mockTokenGenerator.generateRefreshToken).toHaveBeenCalledWith({
      id: "1",
    });
    expect(mockUser.setRefreshToken).toHaveBeenCalledWith("newRefreshToken");
    expect(mockUserRepo.update).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    });
  });

  it("should throw if token is invalid", async () => {
    mockTokenGenerator.verifyRefreshToken.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(useCase.execute("invalidToken")).rejects.toThrow(
      "Invalid refresh token"
    );
  });

  it("should throw if user not found", async () => {
    const payload = { id: "1" };
    mockTokenGenerator.verifyRefreshToken.mockReturnValue(payload);
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute("token")).rejects.toThrow(
      "Invalid refresh token"
    );
  });

  it("should throw if refresh token does not match", async () => {
    const payload = { id: "1" };
    mockTokenGenerator.verifyRefreshToken.mockReturnValue(payload);
    const mockUser = {
      id: "1",
      refreshToken: "differentToken",
    };
    mockUserRepo.findById.mockResolvedValue(mockUser);

    await expect(useCase.execute("token")).rejects.toThrow(
      "Invalid refresh token"
    );
  });
});
