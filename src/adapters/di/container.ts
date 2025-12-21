import { UserRepository } from "@infrastructure/persistence/user.repository.impl";
import { LocationRepository } from "@infrastructure/persistence/location.repository.impl";
import { ShippingRateRepository } from "@infrastructure/persistence/shipping-rate.repository.impl";
import { QuoteRepository } from "@infrastructure/persistence/quote.repository.impl";
import { ShipmentRepository } from "@infrastructure/persistence/shipment.repository.impl";
import { ShipmentStatusEventRepository } from "@infrastructure/persistence/shipment-status-event.repository.impl";
import { JwtService } from "@infrastructure/services/jwt.service";
import { RegisterUserUseCase } from "@application/use-cases/register-user.use-case";
import { LoginUserUseCase } from "@application/use-cases/login-user.use-case";
import { GetLocationsUseCase } from "@application/use-cases/get-locations.use-case";
import { QuoteShipmentUseCase } from "@application/use-cases/quote-shipment.use-case";
import { CreateShipmentUseCase } from "@application/use-cases/create-shipment.use-case";
import { GetUserShipmentsUseCase } from "@application/use-cases/get-user-shipments.use-case";
import { AuthController } from "@adapters/controllers/auth.controller";
import { LocationController } from "@adapters/controllers/location.controller";
import { QuoteController } from "@adapters/controllers/quote.controller";
import { ShipmentController } from "@adapters/controllers/shipment.controller";

// Repositories
const userRepository = new UserRepository();
const locationRepository = new LocationRepository();
const shippingRateRepository = new ShippingRateRepository();
const quoteRepository = new QuoteRepository();
const shipmentRepository = new ShipmentRepository();
const shipmentStatusEventRepository = new ShipmentStatusEventRepository();

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
const createShipmentUseCase = new CreateShipmentUseCase(
  quoteRepository,
  shipmentRepository,
  shipmentStatusEventRepository
);
const getUserShipmentsUseCase = new GetUserShipmentsUseCase(shipmentRepository);

// Controllers
export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase
);

export const locationController = new LocationController(getLocationsUseCase);

export const quoteController = new QuoteController(quoteShipmentUseCase);

export const shipmentController = new ShipmentController(
  createShipmentUseCase,
  getUserShipmentsUseCase
);
