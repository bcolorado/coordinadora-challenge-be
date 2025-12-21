import { IShipmentStatusEventRepository } from "@application/repositories/shipment-status-event.repository";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";
import { executeQuery } from "../config/database.config";
import { ResultSetHeader } from "mysql2";

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
}
