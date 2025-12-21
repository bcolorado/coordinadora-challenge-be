import { IShipmentStatusEventRepository } from "@application/repositories/shipment-status-event.repository";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";

export class MockShipmentStatusEventRepository
  implements IShipmentStatusEventRepository
{
  private events: ShipmentStatusEvent[] = [];
  private nextId = 1;

  async create(event: ShipmentStatusEvent): Promise<ShipmentStatusEvent> {
    const createdEvent = new ShipmentStatusEvent({
      ...event,
      id: this.nextId++,
      occurredAt: new Date(),
    });
    this.events.push(createdEvent);
    return createdEvent;
  }

  async findByShipmentId(shipmentId: number): Promise<ShipmentStatusEvent[]> {
    return this.events.filter((e) => e.shipmentId === shipmentId);
  }

  clear(): void {
    this.events = [];
    this.nextId = 1;
  }

  getEvents(): ShipmentStatusEvent[] {
    return this.events;
  }
}
