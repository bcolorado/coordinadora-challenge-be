import {
  IQuoteRepository,
  QuoteWithLocations,
} from "@application/repositories/quote.repository";
import { Quote } from "@domain/entities/quote.entity";
import { executeQuery } from "../config/database.config";
import { ResultSetHeader } from "mysql2";

interface QuoteWithLocationsRow {
  id: number;
  origin_location_id: number;
  destination_location_id: number;
  actual_weight_kg: number;
  chargeable_weight_kg: number;
  quoted_price_cents: number;
  origin_city: string;
  dest_city: string;
}

export class QuoteRepository implements IQuoteRepository {
  async create(quote: Quote): Promise<Quote> {
    const result = await executeQuery<ResultSetHeader>(
      `INSERT INTO quotes 
       (user_id, origin_location_id, destination_location_id, 
        actual_weight_kg, length_cm, width_cm, height_cm,
        volumetric_weight_kg, chargeable_weight_kg, shipping_rate_id, quoted_price_cents)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quote.userId,
        quote.originLocationId,
        quote.destinationLocationId,
        quote.actualWeightKg,
        quote.lengthCm,
        quote.widthCm,
        quote.heightCm,
        quote.volumetricWeightKg,
        quote.chargeableWeightKg,
        quote.shippingRateId,
        quote.quotedPriceCents,
      ]
    );

    return new Quote({ ...quote, id: result.insertId });
  }

  async findByIdWithLocations(id: number): Promise<QuoteWithLocations | null> {
    const rows = await executeQuery<QuoteWithLocationsRow[]>(
      `SELECT q.id, q.origin_location_id, q.destination_location_id,
              q.actual_weight_kg, q.chargeable_weight_kg, q.quoted_price_cents,
              o.city_name AS origin_city, d.city_name AS dest_city
       FROM quotes q
       INNER JOIN locations o ON q.origin_location_id = o.id
       INNER JOIN locations d ON q.destination_location_id = d.id
       WHERE q.id = ?`,
      [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0]!;
    return {
      id: row.id,
      originLocationId: row.origin_location_id,
      destinationLocationId: row.destination_location_id,
      actualWeightKg: row.actual_weight_kg,
      chargeableWeightKg: row.chargeable_weight_kg,
      quotedPriceCents: row.quoted_price_cents,
      origin: {
        id: row.origin_location_id,
        cityName: row.origin_city,
      },
      destination: {
        id: row.destination_location_id,
        cityName: row.dest_city,
      },
    };
  }
}
