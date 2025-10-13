import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../../domain/exceptions/AppError";
import { convertZodError } from "../validation/zodAdapter";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const errorResponse: any = { code: err.code };
    if (err instanceof ValidationError && err.details) {
      errorResponse.details = err.details;
    }
    return res.status(err.status).json({
      success: false,
      message: err.message,
      error: errorResponse,
    });
  }

  // If it's a Zod error, try to convert it to a user-friendly ValidationError using the adapter.
  try {
    const converted = convertZodError(err);
    if (converted) {
      const validationErr = new ValidationError(converted.message, {
        cause: err,
      });
      validationErr.details = converted.details || [];
      return res.status(400).json({
        success: false,
        message: validationErr.message,
        error: { code: "VALIDATION_ERROR", details: validationErr.details },
      });
    }
  } catch (e) {
    // conversion failed — fall through to generic handler
  }

  // Unknown errors
  console.error(err); // Log for monitoring
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: { code: "INTERNAL_ERROR" },
  });
};
