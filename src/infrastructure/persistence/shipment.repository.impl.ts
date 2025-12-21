import { IShipmentRepository } from "@application/repositories/shipment.repository";
import { Shipment } from "@domain/entities/shipment.entity";
import { executeQuery } from "../config/database.config";
import { ResultSetHeader } from "mysql2";

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
}
