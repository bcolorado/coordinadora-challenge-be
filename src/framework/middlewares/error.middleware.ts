import { Request, Response, NextFunction } from "express";
import { AppError } from "@shared/errors/app-error";
import { errorResponse } from "@shared/types/api-response";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("Error:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.code, err.message));
    return;
  }

  res
    .status(500)
    .json(errorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
}
