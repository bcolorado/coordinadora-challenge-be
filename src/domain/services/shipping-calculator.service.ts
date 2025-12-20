import { ShippingRate } from "../entities/shipping-rate.entity";

export interface PackageDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ShippingCalculationResult {
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  totalPriceCents: number;
}

export class ShippingCalculator {
  private static readonly VOLUMETRIC_DIVISOR = 2500;

  static calculateVolumetricWeight(dimensions: PackageDimensions): number {
    return Math.ceil(
      (dimensions.length * dimensions.width * dimensions.height) /
        this.VOLUMETRIC_DIVISOR
    );
  }

  static calculateChargeableWeight(
    actualWeight: number,
    volumetricWeight: number
  ): number {
    return Math.max(Math.ceil(actualWeight), volumetricWeight);
  }

  static calculatePrice(rate: ShippingRate, chargeableWeight: number): number {
    return rate.basePriceCents + rate.pricePerKgCents * chargeableWeight;
  }

  static calculate(
    actualWeight: number,
    dimensions: PackageDimensions,
    rate: ShippingRate
  ): ShippingCalculationResult {
    const volumetricWeight = this.calculateVolumetricWeight(dimensions);
    const chargeableWeight = this.calculateChargeableWeight(
      actualWeight,
      volumetricWeight
    );
    const totalPriceCents = this.calculatePrice(rate, chargeableWeight);

    return {
      actualWeight,
      volumetricWeight,
      chargeableWeight,
      totalPriceCents,
    };
  }
}
