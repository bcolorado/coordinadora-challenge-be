import { Request, Response } from "express";
import { ValidationError } from "@shared/errors/app-error";
import { successResponse } from "@shared/types/api-response";
import { HandleErrors } from "@shared/errors/error-handler.decorator";
import { RegisterUserUseCase } from "@application/use-cases/register-user.use-case";
import { LoginUserUseCase } from "@application/use-cases/login-user.use-case";
import {
  registerSchema,
  loginSchema,
  validate,
} from "../validators/auth.validator";

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  @HandleErrors()
  async register(req: Request, res: Response): Promise<void> {
    const requestBodyValidation = validate(registerSchema, req.body);
    if (!requestBodyValidation.success) {
      throw new ValidationError(
        "Validation failed",
        requestBodyValidation.errors.format()
      );
    }

    const result = await this.registerUserUseCase.execute(
      requestBodyValidation.data
    );

    res.status(201).json(successResponse(result));
  }

  @HandleErrors()
  async login(req: Request, res: Response): Promise<void> {
    const requestBodyValidation = validate(loginSchema, req.body);
    if (!requestBodyValidation.success) {
      throw new ValidationError(
        "Validation failed",
        requestBodyValidation.errors.format()
      );
    }

    const result = await this.loginUserUseCase.execute(
      requestBodyValidation.data
    );

    res.status(200).json(successResponse(result));
  }
}
