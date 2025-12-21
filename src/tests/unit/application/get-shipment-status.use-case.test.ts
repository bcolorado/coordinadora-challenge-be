import { GetShipmentStatusUseCase } from "@application/use-cases/get-shipment-status.use-case";
import { MockShipmentRepository } from "../../mocks/repositories/mock-shipment.repository";
import { MockShipmentStatusEventRepository } from "../../mocks/repositories/mock-shipment-status-event.repository";
import { MockQuoteRepository } from "../../mocks/repositories/mock-quote.repository";
import { Shipment } from "@domain/entities/shipment.entity";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";
import { Quote } from "@domain/entities/quote.entity";

describe("GetShipmentStatusUseCase", () => {
  let useCase: GetShipmentStatusUseCase;
  let shipmentRepo: MockShipmentRepository;
  let eventRepo: MockShipmentStatusEventRepository;
  let quoteRepo: MockQuoteRepository;

  beforeEach(() => {
    shipmentRepo = new MockShipmentRepository();
    eventRepo = new MockShipmentStatusEventRepository();
    quoteRepo = new MockQuoteRepository();
    useCase = new GetShipmentStatusUseCase(shipmentRepo, eventRepo, quoteRepo);
  });

  it("should return shipment status with quote data for valid tracking number", async () => {
    const quote = await quoteRepo.create(
      new Quote({
        userId: 1,
        originLocationId: 1,
        destinationLocationId: 2,
        actualWeightKg: 5,
        lengthCm: 30,
        widthCm: 20,
        heightCm: 10,
        volumetricWeightKg: 1.2,
        chargeableWeightKg: 5,
        shippingRateId: 1,
        quotedPriceCents: 15000,
      })
    );

    const shipment = await shipmentRepo.create(
      new Shipment({
        userId: 1,
        quoteId: quote.id!,
        trackingNumber: "COORD-TEST-123",
        currentStatus: "EN_TRANSITO",
      })
    );

    await eventRepo.create(
      new ShipmentStatusEvent({
        shipmentId: shipment.id!,
        status: "EN_ESPERA",
        note: "Envío creado",
      })
    );

    const result = await useCase.execute("COORD-TEST-123");

    expect(result).not.toBeNull();
    expect(result!.trackingNumber).toBe("COORD-TEST-123");
    expect(result!.currentStatus).toBe("EN_TRANSITO");
    expect(result!.origin.cityName).toBe("Bogotá");
    expect(result!.destination.cityName).toBe("Medellín");
    expect(result!.chargeableWeightKg).toBe(5);
    expect(result!.quotedPriceCents).toBe(15000);
    expect(result!.history).toHaveLength(1);
  });

  it("should return null for invalid tracking number", async () => {
    const result = await useCase.execute("INVALID-TRACKING");
    expect(result).toBeNull();
  });
});
