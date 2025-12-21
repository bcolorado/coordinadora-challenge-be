import request from "supertest";
import express from "express";
import { ShipmentController } from "@adapters/controllers/shipment.controller";
import { CreateShipmentUseCase } from "@application/use-cases/create-shipment.use-case";
import { MockQuoteRepository } from "../../mocks/repositories/mock-quote.repository";
import { MockShipmentRepository } from "../../mocks/repositories/mock-shipment.repository";
import { MockShipmentStatusEventRepository } from "../../mocks/repositories/mock-shipment-status-event.repository";
import { mockCreateShipmentRequest } from "../../mocks/data/mock-quotes.data";
import { errorMiddleware } from "@framework/middlewares/error.middleware";

const quoteRepo = new MockQuoteRepository();
const shipmentRepo = new MockShipmentRepository();
const eventRepo = new MockShipmentStatusEventRepository();
const useCase = new CreateShipmentUseCase(quoteRepo, shipmentRepo, eventRepo);
const controller = new ShipmentController(useCase);

const app = express();
app.use(express.json());

// Mock middleware to simulate authenticated user
app.use((req, _res, next) => {
  (req as any).user = { userId: 1, email: "test@example.com" };
  next();
});

app.post("/shipments", controller.create.bind(controller));
app.use(errorMiddleware);

describe("Shipment Integration Tests (API)", () => {
  beforeEach(() => {
    quoteRepo.clear();
    shipmentRepo.clear();
    eventRepo.clear();
  });

  it("POST /shipments should create shipment successfully", async () => {
    const response = await request(app)
      .post("/shipments")
      .send(mockCreateShipmentRequest);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.trackingNumber).toMatch(/^COORD-/);
    expect(response.body.data.status).toBe("EN_ESPERA");
    expect(response.body.data.origin.id).toBe(1);
  });

  it("POST /shipments should return 400 when validation fails", async () => {
    const invalidRequest = { ...mockCreateShipmentRequest, origin: undefined };
    const response = await request(app).post("/shipments").send(invalidRequest);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
