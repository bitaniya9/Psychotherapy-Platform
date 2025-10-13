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

dotenv.config();

// Optionally configure zod to use the zod-validation-error error map for friendlier messages
setupZodValidationError();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS),
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS),
  })
);

setupSwagger(app);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use(errorHandler); // Must be last

const PORT = process.env.PORT || 7777;
const HOST = process.env.HOST || "localhost";
app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(`Swagger UI available at http://${HOST}:${PORT}/api-docs`);
});

export default app;
