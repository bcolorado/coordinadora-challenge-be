import { z } from "zod";
import { registerSchema, loginSchema } from "../validators/auth.validator";

/**
 * Request DTOs - inferred from Zod schemas
 */
export type RegisterRequestDto = z.infer<typeof registerSchema>;
export type LoginRequestDto = z.infer<typeof loginSchema>;

/**
 * Response DTOs
 */
export interface RegisterResponseDto {
  id: number;
  email: string;
  fullName: string;
}

export interface LoginResponseDto {
  token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
}
