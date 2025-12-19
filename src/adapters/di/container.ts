import { UserRepository } from "@infrastructure/persistence/user.repository.impl";
import { JwtService } from "@infrastructure/services/jwt.service";
import { RegisterUserUseCase } from "@application/use-cases/register-user.use-case";
import { LoginUserUseCase } from "@application/use-cases/login-user.use-case";
import { AuthController } from "@adapters/controllers/auth.controller";

// Repositories
const userRepository = new UserRepository();

// Services
const jwtService = new JwtService();

// Use Cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);

// Controllers
export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase
);
