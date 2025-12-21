import { Shipment } from "@domain/entities/shipment.entity";

export interface ShipmentWithQuote {
  id: number;
  trackingNumber: string;
  status: string;
  chargeableWeightKg: number;
  quotedPriceCents: number;
  createdAt: Date;
}

export interface IShipmentRepository {
  create(shipment: Shipment): Promise<Shipment>;
  findByUserId(userId: number): Promise<Shipment[]>;
  findByUserIdWithQuote(userId: number): Promise<ShipmentWithQuote[]>;
}
