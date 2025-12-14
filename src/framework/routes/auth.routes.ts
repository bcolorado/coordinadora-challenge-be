import { Router } from "express";
import { AuthController } from "@adapters/controllers/auth.controller";
import { RegisterUserUseCase } from "@application/use-cases/register-user.use-case";
import { LoginUserUseCase } from "@application/use-cases/login-user.use-case";
import { UserRepository } from "@infrastructure/persistence/user.repository.impl";
import { JwtService } from "@infrastructure/services/jwt.service";

const router = Router();

// dependencies
const userRepository = new UserRepository();
const jwtService = new JwtService();

// use cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);

// controllers
const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase
);

// routes
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

export default router;
