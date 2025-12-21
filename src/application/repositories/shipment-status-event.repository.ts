import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";

export interface IShipmentStatusEventRepository {
  create(event: ShipmentStatusEvent): Promise<ShipmentStatusEvent>;
}
