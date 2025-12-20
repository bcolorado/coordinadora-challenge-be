import { ShippingCalculator } from "@domain/services/shipping-calculator.service";
import { ShippingRate } from "@domain/entities/shipping-rate.entity";

describe("ShippingCalculator", () => {
  describe("calculateVolumetricWeight", () => {
    it("should calculate volumetric weight correctly (30x20x15 = 4kg)", () => {
      const dimensions = { length: 30, width: 20, height: 15 };
      const result = ShippingCalculator.calculateVolumetricWeight(dimensions);
      // (30 * 20 * 15) / 2500 = 3.6, ceil = 4
      expect(result).toBe(4);
    });
  });

  describe("calculateChargeableWeight", () => {
    it("should return actual weight when greater than volumetric", () => {
      const result = ShippingCalculator.calculateChargeableWeight(10, 5);
      expect(result).toBe(10);
    });

    it("should return volumetric weight when greater than actual", () => {
      const result = ShippingCalculator.calculateChargeableWeight(3, 8);
      expect(result).toBe(8);
    });

    it("should ceil actual weight before comparison", () => {
      const result = ShippingCalculator.calculateChargeableWeight(5.2, 4);
      expect(result).toBe(6);
    });
  });

  describe("calculatePrice", () => {
    it("should calculate price correctly", () => {
      const rate = new ShippingRate({
        id: 1,
        originLocationId: 1,
        destinationLocationId: 2,
        basePriceCents: 5000,
        pricePerKgCents: 1000,
      });
      const result = ShippingCalculator.calculatePrice(rate, 5);
      // 5000 + (1000 * 5) = 10000
      expect(result).toBe(10000);
    });
  });

  describe("calculate (full flow)", () => {
    it("should return complete calculation result", () => {
      const rate = new ShippingRate({
        id: 1,
        originLocationId: 1,
        destinationLocationId: 2,
        basePriceCents: 8000,
        pricePerKgCents: 1500,
      });

      const result = ShippingCalculator.calculate(
        5.5,
        { length: 30, width: 20, height: 15 },
        rate
      );

      expect(result.actualWeight).toBe(5.5);
      expect(result.volumetricWeight).toBe(4); // (30*20*15)/2500 = 3.6 -> 4
      expect(result.chargeableWeight).toBe(6); // max(ceil(5.5)=6, 4) = 6
      expect(result.totalPriceCents).toBe(17000); // 8000 + (1500 * 6) = 17000
    });
  });
});
