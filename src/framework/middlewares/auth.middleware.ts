import { Request, Response, NextFunction } from "express";
import { JwtService } from "@infrastructure/services/jwt.service";
import { errorResponse } from "@shared/types/api-response";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/docs",
  "/health",
];

const jwtService = new JwtService();

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isPublic = PUBLIC_ROUTES.some(
    (route) => req.path === route || req.path.startsWith(route)
  );

  if (isPublic) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json(errorResponse("UNAUTHORIZED", "Token no proporcionado"));
    return;
  }

  const token = authHeader.substring(7);

  const payload = jwtService.verify(token);

  if (!payload) {
    res
      .status(401)
      .json(errorResponse("UNAUTHORIZED", "Token inválido o expirado"));
    return;
  }

  (req as Request & { user?: { userId: number; email: string } }).user =
    payload;

  next();
}
