import { UserRepository } from "@infrastructure/persistence/user.repository.impl";
import { LocationRepository } from "@infrastructure/persistence/location.repository.impl";
import { JwtService } from "@infrastructure/services/jwt.service";
import { RegisterUserUseCase } from "@application/use-cases/register-user.use-case";
import { LoginUserUseCase } from "@application/use-cases/login-user.use-case";
import { GetLocationsUseCase } from "@application/use-cases/get-locations.use-case";
import { AuthController } from "@adapters/controllers/auth.controller";
import { LocationController } from "@adapters/controllers/location.controller";

// Repositories
const userRepository = new UserRepository();
const locationRepository = new LocationRepository();

// Services
const jwtService = new JwtService();

// Use Cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);
const getLocationsUseCase = new GetLocationsUseCase(locationRepository);

// Controllers
export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase
);

export const locationController = new LocationController(getLocationsUseCase);
