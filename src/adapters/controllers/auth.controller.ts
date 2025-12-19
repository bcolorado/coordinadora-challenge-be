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
import {
  RegisterRequestDto,
  RegisterResponseDto,
  LoginRequestDto,
  LoginResponseDto,
} from "@application/dtos/auth.dto";

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

    const input: RegisterRequestDto = requestBodyValidation.data;
    const result: RegisterResponseDto = await this.registerUserUseCase.execute(
      input
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

    const input: LoginRequestDto = requestBodyValidation.data;
    const result: LoginResponseDto = await this.loginUserUseCase.execute(input);

    res.status(200).json(successResponse(result));
  }
}
