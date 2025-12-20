import { Location } from "@domain/entities/location.entity";
import { ShippingRate } from "@domain/entities/shipping-rate.entity";

export const mockBogota = new Location({ id: 1, cityName: "Bogotá" });
export const mockMedellin = new Location({ id: 2, cityName: "Medellín" });

export const mockRate = new ShippingRate({
  id: 1,
  originLocationId: 1,
  destinationLocationId: 2,
  basePriceCents: 8000,
  pricePerKgCents: 1500,
});

export const mockQuoteRequest = {
  weight: 5.5,
  dimensions: { length: 30, width: 20, height: 15 },
  originId: 1,
  destinationId: 2,
};
