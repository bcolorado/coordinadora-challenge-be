import { IShippingRateRepository } from "@application/repositories/shipping-rate.repository";
import { ShippingRate } from "@domain/entities/shipping-rate.entity";

export class MockShippingRateRepository implements IShippingRateRepository {
  private rates: ShippingRate[] = [];

  async findByRoute(
    originId: number,
    destinationId: number
  ): Promise<ShippingRate | null> {
    return (
      this.rates.find(
        (r) =>
          r.originLocationId === originId &&
          r.destinationLocationId === destinationId
      ) || null
    );
  }

  clear(): void {
    this.rates = [];
  }

  seed(rates: ShippingRate[]): void {
    this.rates = [...rates];
  }
}
