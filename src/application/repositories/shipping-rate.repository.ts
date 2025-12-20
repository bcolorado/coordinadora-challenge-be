import { ShippingRate } from "@domain/entities/shipping-rate.entity";

export interface IShippingRateRepository {
  findByRoute(
    originId: number,
    destinationId: number
  ): Promise<ShippingRate | null>;
}
