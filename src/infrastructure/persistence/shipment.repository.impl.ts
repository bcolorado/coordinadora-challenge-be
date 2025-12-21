import {
  IShipmentRepository,
  ShipmentWithQuote,
} from "@application/repositories/shipment.repository";
import { Shipment, ShipmentStatus } from "@domain/entities/shipment.entity";
import { executeQuery } from "../config/database.config";
import { ResultSetHeader } from "mysql2";

interface ShipmentRow {
  id: number;
  user_id: number;
  quote_id: number;
  tracking_number: string;
  current_status: ShipmentStatus;
  created_at: Date;
  updated_at: Date;
}

interface ShipmentWithQuoteRow {
  id: number;
  tracking_number: string;
  current_status: string;
  chargeable_weight_kg: number;
  quoted_price_cents: number;
  created_at: Date;
}

export class ShipmentRepository implements IShipmentRepository {
  async create(shipment: Shipment): Promise<Shipment> {
    const result = await executeQuery<ResultSetHeader>(
      `INSERT INTO shipments 
       (user_id, quote_id, tracking_number, current_status)
       VALUES (?, ?, ?, ?)`,
      [
        shipment.userId,
        shipment.quoteId,
        shipment.trackingNumber,
        shipment.currentStatus,
      ]
    );

    return new Shipment({ ...shipment, id: result.insertId });
  }

  async findByUserId(userId: number): Promise<Shipment[]> {
    const rows = await executeQuery<ShipmentRow[]>(
      `SELECT id, user_id, quote_id, tracking_number, current_status, created_at, updated_at
       FROM shipments
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return rows.map(
      (row) =>
        new Shipment({
          id: row.id,
          userId: row.user_id,
          quoteId: row.quote_id,
          trackingNumber: row.tracking_number,
          currentStatus: row.current_status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })
    );
  }

  async findByUserIdWithQuote(userId: number): Promise<ShipmentWithQuote[]> {
    const rows = await executeQuery<ShipmentWithQuoteRow[]>(
      `SELECT s.id, s.tracking_number, s.current_status, q.chargeable_weight_kg, q.quoted_price_cents, s.created_at
       FROM shipments s
       INNER JOIN quotes q ON s.quote_id = q.id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [userId]
    );

    return rows.map((row) => ({
      id: row.id,
      trackingNumber: row.tracking_number,
      status: row.current_status,
      chargeableWeightKg: row.chargeable_weight_kg,
      quotedPriceCents: row.quoted_price_cents,
      createdAt: row.created_at,
    }));
  }
}
