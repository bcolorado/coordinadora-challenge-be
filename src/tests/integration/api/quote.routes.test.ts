import request from "supertest";
import express from "express";
import { QuoteController } from "@adapters/controllers/quote.controller";
import { QuoteShipmentUseCase } from "@application/use-cases/quote-shipment.use-case";
import { MockLocationRepository } from "../../mocks/repositories/mock-location.repository";
import { MockShippingRateRepository } from "../../mocks/repositories/mock-shipping-rate.repository";
import {
  mockBogota,
  mockMedellin,
  mockRate,
  mockQuoteRequest,
} from "../../mocks/data/mock-quotes.data";
import { errorMiddleware } from "@framework/middlewares/error.middleware";

const locationRepo = new MockLocationRepository();
const rateRepo = new MockShippingRateRepository();
const useCase = new QuoteShipmentUseCase(locationRepo, rateRepo);
const controller = new QuoteController(useCase);

const app = express();
app.use(express.json());
app.post("/quotes", controller.quote.bind(controller));
app.use(errorMiddleware);

describe("Quote Integration Tests (API)", () => {
  beforeEach(() => {
    locationRepo.clear();
    rateRepo.clear();
    locationRepo.seed([mockBogota, mockMedellin]);
    rateRepo.seed([mockRate]);
  });

  it("POST /quotes should return quote successfully", async () => {
    const response = await request(app).post("/quotes").send(mockQuoteRequest);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.origin.cityName).toBe("Bogotá");
    expect(response.body.data.destination.cityName).toBe("Medellín");
    expect(response.body.data.totalPriceCents).toBe(17000);
  });

  it("POST /quotes should return 404 when origin not found", async () => {
    const response = await request(app)
      .post("/quotes")
      .send({ ...mockQuoteRequest, originId: 999 });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("ORIGIN_NOT_FOUND");
  });

  it("POST /quotes should return 404 when rate not found", async () => {
    rateRepo.clear();

    const response = await request(app).post("/quotes").send(mockQuoteRequest);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("RATE_NOT_FOUND");
  });
});
