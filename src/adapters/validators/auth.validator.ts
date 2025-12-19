import { z } from "zod";

/**
 * Registration Schema
 */
export const registerSchema = z.object({
  document: z
    .string()
    .min(5, "Document must be at least 5 characters")
    .max(50, "Document must be at most 50 characters"),
  documentType: z
    .string()
    .min(2, "Document type must be at least 2 characters")
    .max(20, "Document type must be at most 20 characters"),
  email: z
    .string()
    .email("Invalid email format")
    .max(255, "Email must be at most 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be at most 100 characters"),
  secondName: z
    .string()
    .max(100, "Second name must be at most 100 characters")
    .optional(),
  firstSurname: z
    .string()
    .min(2, "First surname must be at least 2 characters")
    .max(100, "First surname must be at most 100 characters"),
  secondSurname: z
    .string()
    .max(100, "Second surname must be at most 100 characters")
    .optional(),
});

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Validation helper
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
