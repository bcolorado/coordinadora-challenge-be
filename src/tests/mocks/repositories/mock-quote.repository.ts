import {
  IQuoteRepository,
  QuoteWithLocations,
} from "@application/repositories/quote.repository";
import { Quote } from "@domain/entities/quote.entity";

export class MockQuoteRepository implements IQuoteRepository {
  private quotes: Quote[] = [];
  private nextId = 1;

  async create(quote: Quote): Promise<Quote> {
    const createdQuote = new Quote({
      ...quote,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.quotes.push(createdQuote);
    return createdQuote;
  }

  async findById(id: number): Promise<Quote | null> {
    return this.quotes.find((q) => q.id === id) || null;
  }

  async findByIdWithLocations(id: number): Promise<QuoteWithLocations | null> {
    const quote = this.quotes.find((q) => q.id === id);
    if (!quote) return null;

    return {
      id: quote.id!,
      originLocationId: quote.originLocationId,
      destinationLocationId: quote.destinationLocationId,
      actualWeightKg: quote.actualWeightKg,
      chargeableWeightKg: quote.chargeableWeightKg,
      quotedPriceCents: quote.quotedPriceCents,
      origin: {
        id: quote.originLocationId,
        cityName: "Bogotá",
      },
      destination: {
        id: quote.destinationLocationId,
        cityName: "Medellín",
      },
    };
  }

  clear(): void {
    this.quotes = [];
    this.nextId = 1;
  }
}
