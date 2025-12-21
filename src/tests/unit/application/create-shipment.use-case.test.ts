import { CreateShipmentUseCase } from "@application/use-cases/create-shipment.use-case";
import { MockQuoteRepository } from "../../mocks/repositories/mock-quote.repository";
import { MockShipmentRepository } from "../../mocks/repositories/mock-shipment.repository";
import { MockShipmentStatusEventRepository } from "../../mocks/repositories/mock-shipment-status-event.repository";
import { mockCreateShipmentRequest } from "../../mocks/data/mock-quotes.data";

describe("CreateShipmentUseCase", () => {
  let useCase: CreateShipmentUseCase;
  let quoteRepo: MockQuoteRepository;
  let shipmentRepo: MockShipmentRepository;
  let eventRepo: MockShipmentStatusEventRepository;

  beforeEach(() => {
    quoteRepo = new MockQuoteRepository();
    shipmentRepo = new MockShipmentRepository();
    eventRepo = new MockShipmentStatusEventRepository();
    useCase = new CreateShipmentUseCase(quoteRepo, shipmentRepo, eventRepo);
  });

  it("should create a shipment successfully", async () => {
    const userId = 1;
    const result = await useCase.execute(mockCreateShipmentRequest, userId);

    expect(result.id).toBeDefined();
    expect(result.trackingNumber).toMatch(/^COORD-/);
    expect(result.status).toBe("EN_ESPERA");
    expect(result.origin.cityName).toBe("Bogotá");
    expect(result.destination.cityName).toBe("Medellín");
    expect(result.quotedPriceCents).toBe(17000);

    const createdShipments = shipmentRepo.getShipments();
    expect(createdShipments).toHaveLength(1);
    expect(createdShipments[0]?.userId).toBe(userId);

    const createdEvents = eventRepo.getEvents();
    expect(createdEvents).toHaveLength(1);
    expect(createdEvents[0]?.status).toBe("EN_ESPERA");
  });
});
