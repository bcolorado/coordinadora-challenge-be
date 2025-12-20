import { UserRepository } from "@infrastructure/persistence/user.repository.impl";
import { LocationRepository } from "@infrastructure/persistence/location.repository.impl";
import { ShippingRateRepository } from "@infrastructure/persistence/shipping-rate.repository.impl";
import { JwtService } from "@infrastructure/services/jwt.service";
import { RegisterUserUseCase } from "@application/use-cases/register-user.use-case";
import { LoginUserUseCase } from "@application/use-cases/login-user.use-case";
import { GetLocationsUseCase } from "@application/use-cases/get-locations.use-case";
import { QuoteShipmentUseCase } from "@application/use-cases/quote-shipment.use-case";
import { AuthController } from "@adapters/controllers/auth.controller";
import { LocationController } from "@adapters/controllers/location.controller";
import { QuoteController } from "@adapters/controllers/quote.controller";

// Repositories
const userRepository = new UserRepository();
const locationRepository = new LocationRepository();
const shippingRateRepository = new ShippingRateRepository();

// Services
const jwtService = new JwtService();

// Use Cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);
const getLocationsUseCase = new GetLocationsUseCase(locationRepository);
const quoteShipmentUseCase = new QuoteShipmentUseCase(
  locationRepository,
  shippingRateRepository
);

// Controllers
export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase
);

export const locationController = new LocationController(getLocationsUseCase);

export const quoteController = new QuoteController(quoteShipmentUseCase);
