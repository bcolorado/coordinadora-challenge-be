import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "./app-error";
import { errorResponse } from "../types/api-response";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Decorator function for handling errors in controller methods
 */
export function HandleErrors() {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value as AsyncHandler;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        await originalMethod.call(this, req, res, next);
      } catch (error) {
        if (error instanceof ValidationError) {
          res
            .status(error.statusCode)
            .json(errorResponse(error.code, error.message, error.details));
          return;
        }

        if (error instanceof AppError) {
          res
            .status(error.statusCode)
            .json(errorResponse(error.code, error.message));
          return;
        }

        // Unexpected errors
        console.error("Unexpected error:", error);
        res
          .status(500)
          .json(
            errorResponse("INTERNAL_ERROR", "An unexpected error occurred")
          );
      }
    };

    return descriptor;
  };
}
