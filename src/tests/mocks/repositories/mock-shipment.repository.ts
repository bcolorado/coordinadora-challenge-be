import { IShipmentRepository } from "@application/repositories/shipment.repository";
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

  clear(): void {
    this.shipments = [];
    this.nextId = 1;
  }

  getShipments(): Shipment[] {
    return this.shipments;
  }
}
