import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error("API Error", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Validation error
  if (err instanceof ZodError) {
    return res.error(400, "Validation error", err.issues);
  }

  // Custom APIError
  if (err instanceof ApiError) {
    return res.error(err.statusCode, err.message, err.details);
  }

  // Unknown error
  const isDev = process.env.NODE_ENV !== "production";

  return res.error(
    500,
    "Internal server error",
    isDev ? err?.message : undefined // Jangan expose error di production
  );
};
