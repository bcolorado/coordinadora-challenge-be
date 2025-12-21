import request from "supertest";
import express from "express";
import { ShipmentController } from "@adapters/controllers/shipment.controller";
import { CreateShipmentUseCase } from "@application/use-cases/create-shipment.use-case";
import { GetUserShipmentsUseCase } from "@application/use-cases/get-user-shipments.use-case";
import { GetShipmentStatusUseCase } from "@application/use-cases/get-shipment-status.use-case";
import { MockQuoteRepository } from "../../mocks/repositories/mock-quote.repository";
import { MockShipmentRepository } from "../../mocks/repositories/mock-shipment.repository";
import { MockShipmentStatusEventRepository } from "../../mocks/repositories/mock-shipment-status-event.repository";
import { mockCreateShipmentRequest } from "../../mocks/data/mock-quotes.data";
import { errorMiddleware } from "@framework/middlewares/error.middleware";
import { Shipment } from "@domain/entities/shipment.entity";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";
import { Quote } from "@domain/entities/quote.entity";

const quoteRepo = new MockQuoteRepository();
const shipmentRepo = new MockShipmentRepository();
const eventRepo = new MockShipmentStatusEventRepository();

const createUseCase = new CreateShipmentUseCase(
  quoteRepo,
  shipmentRepo,
  eventRepo
);
const getUserShipmentsUseCase = new GetUserShipmentsUseCase(shipmentRepo);
const getStatusUseCase = new GetShipmentStatusUseCase(
  shipmentRepo,
  eventRepo,
  quoteRepo
);

const controller = new ShipmentController(
  createUseCase,
  getUserShipmentsUseCase,
  getStatusUseCase
);

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  (req as any).user = { userId: 1, email: "test@example.com" };
  next();
});

app.post("/shipments", controller.create.bind(controller));
app.get("/shipments", controller.getAll.bind(controller));
app.get("/:trackingNumber/status", controller.getStatus.bind(controller));
app.use(errorMiddleware);

describe("Shipment Routes Integration Tests", () => {
  beforeEach(() => {
    quoteRepo.clear();
    shipmentRepo.clear();
    eventRepo.clear();
  });

  describe("POST /shipments", () => {
    it("should create shipment successfully", async () => {
      const response = await request(app)
        .post("/shipments")
        .send(mockCreateShipmentRequest);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trackingNumber).toMatch(/^COORD-/);
      expect(response.body.data.status).toBe("EN_ESPERA");
    });

    it("should return 400 when validation fails", async () => {
      const invalidRequest = {
        ...mockCreateShipmentRequest,
        origin: undefined,
      };
      const response = await request(app)
        .post("/shipments")
        .send(invalidRequest);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /:trackingNumber/status", () => {
    it("should return status with quote data for valid tracking number", async () => {
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
          trackingNumber: "COORD-TEST-ABC",
          currentStatus: "EN_ESPERA",
        })
      );

      await eventRepo.create(
        new ShipmentStatusEvent({
          shipmentId: shipment.id!,
          status: "EN_ESPERA",
          note: "Envío creado",
        })
      );

      const response = await request(app).get("/COORD-TEST-ABC/status");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.trackingNumber).toBe("COORD-TEST-ABC");
      expect(response.body.data.currentStatus).toBe("EN_ESPERA");
      expect(response.body.data.origin.cityName).toBe("Bogotá");
      expect(response.body.data.destination.cityName).toBe("Medellín");
      expect(response.body.data.chargeableWeightKg).toBe(5);
      expect(response.body.data.quotedPriceCents).toBe(15000);
      expect(response.body.data.history).toHaveLength(1);
    });

    it("should return 404 for invalid tracking number", async () => {
      const response = await request(app).get("/INVALID-TRACKING/status");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
