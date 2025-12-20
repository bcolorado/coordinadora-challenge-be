// Generates shipping rates between locations
// base_price_cents: Random between 5000-15000
// price_per_kg_cents: Random between 500-2000

export function generateShippingRates(locationCount: number) {
  const rates: {
    originId: number;
    destinationId: number;
    basePriceCents: number;
    pricePerKgCents: number;
  }[] = [];

  for (let origin = 1; origin <= locationCount; origin++) {
    for (let destination = 1; destination <= locationCount; destination++) {
      if (origin !== destination) {
        rates.push({
          originId: origin,
          destinationId: destination,
          basePriceCents: Math.floor(Math.random() * 10000) + 5000,
          pricePerKgCents: Math.floor(Math.random() * 1500) + 500,
        });
      }
    }
  }

  return rates;
}
