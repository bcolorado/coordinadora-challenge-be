import { AppError } from "@shared/errors/app-error";

export class InvalidCredentialsException extends AppError {
  constructor() {
    super("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
  }
}

export class UserAlreadyExistsException extends AppError {
  constructor(field: "email" | "document") {
    super(
      `Un usuario con este campo ${field} ya existe`,
      409,
      "USER_ALREADY_EXISTS"
    );
  }
}
