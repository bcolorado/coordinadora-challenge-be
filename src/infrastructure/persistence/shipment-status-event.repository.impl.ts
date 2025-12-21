import { IShipmentStatusEventRepository } from "@application/repositories/shipment-status-event.repository";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";
import { ShipmentStatus } from "@domain/entities/quote.entity";
import { executeQuery } from "../config/database.config";
import { ResultSetHeader } from "mysql2";

interface StatusEventRow {
  id: number;
  shipment_id: number;
  status: ShipmentStatus;
  occurred_at: Date;
  note: string | null;
}

export class ShipmentStatusEventRepository
  implements IShipmentStatusEventRepository
{
  async create(event: ShipmentStatusEvent): Promise<ShipmentStatusEvent> {
    const result = await executeQuery<ResultSetHeader>(
      `INSERT INTO shipment_status_events 
       (shipment_id, status, note)
       VALUES (?, ?, ?)`,
      [event.shipmentId, event.status, event.note]
    );

    return new ShipmentStatusEvent({ ...event, id: result.insertId });
  }

  async findByShipmentId(shipmentId: number): Promise<ShipmentStatusEvent[]> {
    const rows = await executeQuery<StatusEventRow[]>(
      `SELECT id, shipment_id, status, occurred_at, note
       FROM shipment_status_events
       WHERE shipment_id = ?
       ORDER BY occurred_at DESC`,
      [shipmentId]
    );

    return rows.map(
      (row) =>
        new ShipmentStatusEvent({
          id: row.id,
          shipmentId: row.shipment_id,
          status: row.status,
          occurredAt: row.occurred_at,
          note: row.note,
        })
    );
  }
}
