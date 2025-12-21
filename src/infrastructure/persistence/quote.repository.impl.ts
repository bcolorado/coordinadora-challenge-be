import { IQuoteRepository } from "@application/repositories/quote.repository";
import { Quote } from "@domain/entities/quote.entity";
import { executeQuery } from "../config/database.config";
import { ResultSetHeader } from "mysql2";

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
}
