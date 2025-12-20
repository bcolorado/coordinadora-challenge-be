import { IShippingRateRepository } from "@application/repositories/shipping-rate.repository";
import { ShippingRate } from "@domain/entities/shipping-rate.entity";
import { executeQuery } from "../config/database.config";

interface ShippingRateRow {
  id: number;
  origin_location_id: number;
  destination_location_id: number;
  base_price_cents: number;
  price_per_kg_cents: number;
  created_at: Date;
  updated_at: Date;
}

export class ShippingRateRepository implements IShippingRateRepository {
  async findByRoute(
    originId: number,
    destinationId: number
  ): Promise<ShippingRate | null> {
    const rows = await executeQuery<ShippingRateRow[]>(
      `SELECT id, origin_location_id, destination_location_id, 
              base_price_cents, price_per_kg_cents, created_at, updated_at 
       FROM shipping_rates 
       WHERE origin_location_id = ? AND destination_location_id = ?`,
      [originId, destinationId]
    );

    if (rows.length === 0) return null;

    const row = rows[0]!;
    return new ShippingRate({
      id: row.id,
      originLocationId: row.origin_location_id,
      destinationLocationId: row.destination_location_id,
      basePriceCents: row.base_price_cents,
      pricePerKgCents: row.price_per_kg_cents,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
