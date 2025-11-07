import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import authRoutes from "./presentation/routes/authRoutes";
import userRoutes from "./presentation/routes/userRoutes";
import { setupSwagger } from "./presentation/swagger";
import { z as zod } from "zod";
import { setupZodValidationError } from "./presentation/validation/zodAdapter";
import {startOTPCleanup} from "./infrastructure/scheduler/TokenCleanup"
import { PrismaUserRepository } from "./infrastructure/database/UserRepository";
import { NodeCronScheduler } from "./infrastructure/scheduler/NodeCronScheduler";
import { CleanExpiredOTPUseCase } from "./application/use-cases/auth/CleanExpiredOTPUseCase";

import TherapistProfileRoutes from "./presentation/routes/TherapistProfileRoutes"


dotenv.config();

// Optionally configure zod to use the zod-validation-error error map for friendlier messages
setupZodValidationError();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
// Configure rate limiter with safe defaults. Some CI environments may not provide
// RATE_LIMIT_* env vars, which would make Number(...) return NaN and crash.
const rlWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS);
const rlMax = Number(process.env.RATE_LIMIT_MAX_REQUESTS);
app.use(
  rateLimit({
    windowMs:
      Number.isFinite(rlWindowMs) && rlWindowMs > 0
        ? rlWindowMs
        : 15 * 60 * 1000, // default 15 minutes
    max: Number.isFinite(rlMax) && rlMax > 0 ? rlMax : 100,
  })
);

setupSwagger(app);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/TherapistProfiles",TherapistProfileRoutes);

const scheduler = new NodeCronScheduler();
const userRepository = new PrismaUserRepository();
const useCase = new CleanExpiredOTPUseCase(userRepository);
const otpCleanup = new startOTPCleanup(scheduler, useCase);
otpCleanup.start();

app.use(errorHandler); // Must be last

const PORT = process.env.PORT || 7777;
const HOST = process.env.HOST || "localhost";
app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(`Swagger UI available at http://${HOST}:${PORT}/api-docs`);
});

export default app;
