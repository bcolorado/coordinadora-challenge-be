import { QuoteShipmentUseCase } from "@application/use-cases/quote-shipment.use-case";
import { MockLocationRepository } from "../../mocks/repositories/mock-location.repository";
import { MockShippingRateRepository } from "../../mocks/repositories/mock-shipping-rate.repository";
import {
  mockBogota,
  mockMedellin,
  mockRate,
  mockQuoteRequest,
} from "../../mocks/data/mock-quotes.data";
import { AppError } from "@shared/errors/app-error";

describe("QuoteShipmentUseCase", () => {
  let useCase: QuoteShipmentUseCase;
  let locationRepo: MockLocationRepository;
  let rateRepo: MockShippingRateRepository;

  beforeEach(() => {
    locationRepo = new MockLocationRepository();
    rateRepo = new MockShippingRateRepository();
    useCase = new QuoteShipmentUseCase(locationRepo, rateRepo);

    locationRepo.seed([mockBogota, mockMedellin]);
    rateRepo.seed([mockRate]);
  });

  it("should calculate quote successfully", async () => {
    const result = await useCase.execute(mockQuoteRequest);

    expect(result.origin.cityName).toBe("Bogotá");
    expect(result.destination.cityName).toBe("Medellín");
    expect(result.volumetricWeight).toBe(4);
    expect(result.chargeableWeight).toBe(6);
    expect(result.totalPriceCents).toBe(17000);
  });

  it("should throw when origin not found", async () => {
    const request = { ...mockQuoteRequest, originId: 999 };

    await expect(useCase.execute(request)).rejects.toThrow(AppError);
    await expect(useCase.execute(request)).rejects.toThrow(
      "Origen no encontrado"
    );
  });

  it("should throw when destination not found", async () => {
    const request = { ...mockQuoteRequest, destinationId: 999 };

    await expect(useCase.execute(request)).rejects.toThrow(AppError);
    await expect(useCase.execute(request)).rejects.toThrow(
      "Destino no encontrado"
    );
  });

  it("should throw when rate not found for route", async () => {
    rateRepo.clear();

    await expect(useCase.execute(mockQuoteRequest)).rejects.toThrow(AppError);
    await expect(useCase.execute(mockQuoteRequest)).rejects.toThrow(
      "No hay tarifa disponible para esta ruta"
    );
  });
});
