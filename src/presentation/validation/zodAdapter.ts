import { z as zod } from "zod";
import type { ZodError } from "zod";

/**
 * Try to set up zod with zod-validation-error's friendly error map.
 * This is optional and will be a no-op if the package is not installed.
 */
export function setupZodValidationError(): void {
  try {
    // dynamic require so this package remains optional
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createErrorMap } = require("zod-validation-error");
    zod.config({ customError: createErrorMap() });
  } catch (e) {
    // package not installed or failed — keep default zod behavior
  }
}

/**
 * Convert an error (possibly a ZodError) into a friendly validation result.
 * Returns an object with { message, details } or null if conversion not possible.
 */
export function convertZodError(
  err: unknown
): { message: string; details: any[] } | null {
  try {
    // prefer using zod-validation-error's fromError when available for best messages
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const maybe = require("zod-validation-error");
    if (maybe && typeof maybe.fromError === "function") {
      const zodValidation = maybe.fromError(err as any);
      if (zodValidation) {
        return {
          message: zodValidation.toString(),
          details: (err as any).issues || (err as any).errors || [],
        };
      }
    }

    // Fallback: if it's a ZodError, extract issues
    if ((err as ZodError)?.issues) {
      const zErr = err as ZodError;
      const msg = zErr.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return { message: msg, details: zErr.issues };
    }
  } catch (e) {
    // ignore and return null
  }
  return null;
}

export default { setupZodValidationError, convertZodError };
