import express from "express";
import { AuthController } from "../controllers/AuthController";
import {
  authenticate,
  authorize,
  AuthRequest,
} from "../middlewares/authenticate";
import { Role } from "@prisma/client";
// Infrastructure bindings for wiring dependencies (kept at route level)
import { PrismaUserRepository } from "../../infrastructure/database/UserRepository";
import { BcryptPasswordHasher } from "../../infrastructure/security/BcryptPasswordHasher";
import { JWTTokenGenerator } from "../../infrastructure/security/JWTTokenGenerator";
import { SimpleOTPGenerator } from "../../infrastructure/security/SimpleOTPGenerator";
import { NodemailerEmailService } from "../../infrastructure/email/NodemailerEmailService";
import { RegisterUseCase } from "../../application/use-cases/auth/RegisterUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import { VerifyEmailUseCase } from "../../application/use-cases/auth/VerifyEmailUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../application/use-cases/auth/ResetPasswordUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/RefreshTokenUseCase";
import { LogoutUseCase } from "../../application/use-cases/auth/LogoutUseCase";
import { IUserRepository } from "../../application/interfaces/IUserRepository";

const router = express.Router();

// Wire concrete implementations here and inject into controller instance
const userRepo = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenGenerator = new JWTTokenGenerator();
const otpGenerator = new SimpleOTPGenerator();
const emailService = new NodemailerEmailService();

const registerUseCase = new RegisterUseCase(
  userRepo,
  passwordHasher,
  tokenGenerator,
  otpGenerator,
  emailService
);
const loginUseCase = new LoginUseCase(userRepo, passwordHasher, tokenGenerator);
const verifyEmailUseCase = new VerifyEmailUseCase(userRepo, emailService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(
  userRepo,
  otpGenerator,
  emailService
);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepo, passwordHasher);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepo, tokenGenerator);
const logoutUseCase = new LogoutUseCase(userRepo);

const authController = new AuthController(
  registerUseCase,
  loginUseCase,
  verifyEmailUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  refreshTokenUseCase,
  logoutUseCase,
  userRepo as IUserRepository
);

router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/verify-email", authController.verifyEmail.bind(authController));
router.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);
router.post(
  "/reset-password",
  authController.resetPassword.bind(authController)
);
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.post(
  "/logout",
  authenticate,
  authController.logout.bind(authController)
);

// user management has been moved to dedicated userRoutes

// Example protected route
router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    data: (req as AuthRequest).user,
    message: "User profile",
  });
});

export default router;
