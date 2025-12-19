import { AppError } from "@shared/errors/app-error";

export class InvalidCredentialsException extends AppError {
  constructor() {
    super("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }
}

export class UserAlreadyExistsException extends AppError {
  constructor(field: "email" | "document") {
    super(
      `A user with this ${field} already exists`,
      409,
      "USER_ALREADY_EXISTS"
    );
  }
}
