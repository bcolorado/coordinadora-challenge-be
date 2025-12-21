import {
  IShipmentRepository,
  ShipmentWithQuote,
} from "@application/repositories/shipment.repository";
import { Shipment } from "@domain/entities/shipment.entity";

export class MockShipmentRepository implements IShipmentRepository {
  private shipments: Shipment[] = [];
  private nextId = 1;

  async create(shipment: Shipment): Promise<Shipment> {
    const createdShipment = new Shipment({
      ...shipment,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.shipments.push(createdShipment);
    return createdShipment;
  }

  async findById(id: number): Promise<Shipment | null> {
    return this.shipments.find((s) => s.id === id) || null;
  }

  async findByUserId(userId: number): Promise<Shipment[]> {
    return this.shipments.filter((s) => s.userId === userId);
  }

  async findByUserIdWithQuote(userId: number): Promise<ShipmentWithQuote[]> {
    return this.shipments
      .filter((s) => s.userId === userId)
      .map((s) => ({
        id: s.id!,
        trackingNumber: s.trackingNumber,
        status: s.currentStatus,
        chargeableWeightKg: 0,
        quotedPriceCents: 0,
        createdAt: s.createdAt ?? new Date(),
      }));
  }

  clear(): void {
    this.shipments = [];
    this.nextId = 1;
  }

  getShipments(): Shipment[] {
    return this.shipments;
  }
}
