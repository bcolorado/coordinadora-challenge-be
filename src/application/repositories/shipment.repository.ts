import { Shipment } from "@domain/entities/shipment.entity";

export interface IShipmentRepository {
  create(shipment: Shipment): Promise<Shipment>;
}
