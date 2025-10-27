import { Request, Response } from "express";
import { z } from "zod";
import { UnauthorizedError } from "../../domain/exceptions/AppError";

import {
  RegisterUseCase,
  RegisterDTO,
} from "../../application/use-cases/auth/RegisterUseCase";
import {
  LoginUseCase,
  LoginDTO,
} from "../../application/use-cases/auth/LoginUseCase";
import { VerifyEmailUseCase } from "../../application/use-cases/auth/VerifyEmailUseCase";
import { ForgotPasswordUseCase } from "../../application/use-cases/auth/ForgotPasswordUseCase";
import {
  ResetPasswordUseCase,
  ResetPasswordDTO,
} from "../../application/use-cases/auth/ResetPasswordUseCase";
import { RefreshTokenUseCase } from "../../application/use-cases/auth/RefreshTokenUseCase";
import { LogoutUseCase } from "../../application/use-cases/auth/LogoutUseCase";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userUpdateSchema,
  userReplaceSchema,
} from "../validators/authValidators";
import { AuthRequest } from "../middlewares/authenticate";

// Dependency Injection (manual for simplicity)
import { IUserRepository } from "../../application/interfaces/IUserRepository";

// Controller no longer constructs infrastructure directly. Dependencies are injected
// from the route wiring (keeps controller aligned with clean architecture).

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private verifyEmailUseCase: VerifyEmailUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private logoutUseCase: LogoutUseCase,
    // optional user repository for user management endpoints
    private userRepository?: IUserRepository
  ) {}
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: { type: string }
   *               password: { type: string }
   *               firstName: { type: string }
   *               lastName: { type: string }
   *               role: { type: string, enum: [PATIENT, THERAPIST, ADMIN] }
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean }
   *                 data: { type: object }
   *                 message: { type: string }
   */
  async register(req: Request, res: Response) {
    const dto = registerSchema.parse(req.body) as RegisterDTO;
    const result = await this.registerUseCase.execute(dto);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      domain: process.env.COOKIE_DOMAIN,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      success: true,
      data: { user: result.user, accessToken: result.accessToken },
      message: "User registered. A verification code was sent to your email.",
    });
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: { type: string }
   *               password: { type: string }
   *     responses:
   *       200:
   *         description: Login successful
   */
  async login(req: Request, res: Response) {
    const dto = loginSchema.parse(req.body) as LoginDTO;
    const result = await this.loginUseCase.execute(dto);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      domain: process.env.COOKIE_DOMAIN,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      data: { user: result.user, accessToken: result.accessToken },
      message: "Login successful",
    });
  }

  /**
   * @swagger
   * /auth/verify-email:
   *   post:
   *     summary: Verify email with token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: { type: string }
   *               otp: { type: string }
   *     responses:
   *       200:
   *         description: Email verified
   */
  async verifyEmail(req: Request, res: Response) {
    // Now require both email + otp to avoid OTP collisions and be explicit
    const parsed = verifyEmailSchema.parse(req.body) as any;
    const { email, otp } = parsed;
    await this.verifyEmailUseCase.execute(email, otp);
    res.json({
      success: true,
      data: null,
      message: "Email verified successfully",
    });
  }

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     summary: Request password reset
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email: { type: string }
   *     responses:
   *       200:
   *         description: Reset email sent
   */
  async forgotPassword(req: Request, res: Response) {
    const { email } = forgotPasswordSchema.parse(req.body);
    await this.forgotPasswordUseCase.execute(email);
    res.json({
      success: true,
      data: null,
      message: "Password reset email sent",
    });
  }

  /**
   * @swagger
   * /auth/reset-password:
   *   post:
   *     summary: Reset password with OTP
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               token: { type: string }
   *               newPassword: { type: string }
   *     responses:
   *       200:
   *         description: Password reset successful
   */
  async resetPassword(req: Request, res: Response) {
    const parsed = resetPasswordSchema.parse(req.body) as any;
    const dto: ResetPasswordDTO = {
      token: parsed.otp,
      newPassword: parsed.newPassword,
    };
    await this.resetPasswordUseCase.execute(dto);
    res.json({
      success: true,
      data: null,
      message: "Password reset successful",
    });
  }

  /**
   * @swagger
   * /auth/refresh-token:
   *   post:
   *     summary: Refresh access token
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Tokens refreshed
   */
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token required");
    }
    const result = await this.refreshTokenUseCase.execute(refreshToken);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      domain: process.env.COOKIE_DOMAIN,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      data: { accessToken: result.accessToken },
      message: "Tokens refreshed",
    });
  }

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   */
  async logout(req: AuthRequest, res: Response) {
    if (!req.user) throw new UnauthorizedError("Authentication required");
    await this.logoutUseCase.execute(req.user.id);
    res.clearCookie("refreshToken");
    res.json({
      success: true,
      data: null,
      message: "Logout successful",
    });
  }

  // Users management
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: List users with pagination
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: size
   *         schema:
   *           type: integer
   *         description: Page size
   *     responses:
   *       200:
   *         description: A paginated list of users
   */
  async listUsers(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const size = Number(req.query.size || 10);
    const repo = this.userRepository as any;
    const result = await repo.list(page, size);
    res.json({ success: true, data: result, message: "Users fetched" });
  }

  async getUserById(req: Request, res: Response) {
    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get user by id
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User found
     *       404:
     *         description: User not found
     */
    const id = req.params.id;
    const repo = this.userRepository as any;
    const user = await repo.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user.toJSON(), message: "User fetched" });
  }

  async patchUser(req: Request, res: Response) {
    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     summary: Partially update a user
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: User updated
     *       404:
     *         description: User not found
     */
    const id = req.params.id;
    const dto = userUpdateSchema.parse(req.body);
    const repo = this.userRepository as any;
    const updated = await repo.updateFields(id, dto);
    res.json({
      success: true,
      data: updated.toJSON(),
      message: "User updated",
    });
  }

  async replaceUser(req: Request, res: Response) {
    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Replace a user
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     responses:
     *       200:
     *         description: User replaced
     *       404:
     *         description: User not found
     */
    const id = req.params.id;
    const dto = userReplaceSchema.parse(req.body) as RegisterDTO;
    const repo = this.userRepository as any;
    const existing = await repo.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    existing.updatePassword(dto.password);
    // apply other fields
    // don't set email verification token to email; if replacing a user we should clear verification state
    existing.setEmailVerificationToken(null as any, new Date());
    existing["props"].firstName = dto.firstName;
    existing["props"].lastName = dto.lastName;
    existing["props"].role = dto.role;
    const saved = await repo.update(existing);
    res.json({ success: true, data: saved.toJSON(), message: "User replaced" });
  }

  async deleteUser(req: Request, res: Response) {
    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete a user
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted
     *       404:
     *         description: User not found
     */
    const id = req.params.id;
    const repo = this.userRepository as any;
    await repo.delete(id);
    res.json({ success: true, data: null, message: "User deleted" });
  }
}
