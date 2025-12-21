import { Shipment, ShipmentStatus } from "@domain/entities/shipment.entity";

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
  findById(id: number): Promise<Shipment | null>;
  findByTrackingNumber(trackingNumber: string): Promise<Shipment | null>;
  findByUserId(userId: number): Promise<Shipment[]>;
  findByUserIdWithQuote(userId: number): Promise<ShipmentWithQuote[]>;
  updateStatus(id: number, status: ShipmentStatus): Promise<void>;
}
