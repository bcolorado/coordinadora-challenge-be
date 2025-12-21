import { Quote } from "@domain/entities/quote.entity";

export interface QuoteWithLocations {
  id: number;
  originLocationId: number;
  destinationLocationId: number;
  actualWeightKg: number;
  chargeableWeightKg: number;
  quotedPriceCents: number;
  origin: {
    id: number;
    cityName: string;
  };
  destination: {
    id: number;
    cityName: string;
  };
}

export interface IQuoteRepository {
  create(quote: Quote): Promise<Quote>;
  findByIdWithLocations(id: number): Promise<QuoteWithLocations | null>;
}
