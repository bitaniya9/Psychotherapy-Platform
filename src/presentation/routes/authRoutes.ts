import express, { Response } from "express";
import { AuthController } from "../controllers/AuthController";
import {
  authenticate,
  authorize,
  AuthRequest,
} from "../middlewares/authenticate";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", authenticate, AuthController.logout);

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
