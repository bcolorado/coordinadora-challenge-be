import "dotenv/config";
import { pool } from "../config/database.config";
import { colombianCities } from "./seeders/locations.seed";
import { generateShippingRates } from "./seeders/shipping-rates.seed";

async function seed() {
  console.log("Starting database seed...");

  try {
    // 1. Clear existing data (in reverse order due to FK constraints)
    console.log("Clearing existing data...");
    await pool.execute("DELETE FROM shipping_rates");
    await pool.execute("DELETE FROM locations");

    // 2. Insert locations
    console.log("Inserting locations...");
    for (const city of colombianCities) {
      await pool.execute("INSERT INTO locations (city_name) VALUES (?)", [
        city,
      ]);
    }
    console.log(`Inserted ${colombianCities.length} locations.`);

    // 3. Insert shipping rates
    console.log("Inserting shipping rates...");
    const rates = generateShippingRates(colombianCities.length);
    for (const rate of rates) {
      await pool.execute(
        "INSERT INTO shipping_rates (origin_location_id, destination_location_id, base_price_cents, price_per_kg_cents) VALUES (?, ?, ?, ?)",
        [
          rate.originId,
          rate.destinationId,
          rate.basePriceCents,
          rate.pricePerKgCents,
        ]
      );
    }
    console.log(`Inserted ${rates.length} shipping rates.`);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
