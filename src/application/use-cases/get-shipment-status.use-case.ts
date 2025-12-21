import { IShipmentRepository } from "../repositories/shipment.repository";
import { IShipmentStatusEventRepository } from "../repositories/shipment-status-event.repository";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";
import { Shipment } from "@domain/entities/shipment.entity";

export interface ShipmentStatusDto {
  id: number;
  trackingNumber: string;
  currentStatus: string;
  history: {
    status: string;
    occurredAt: string;
    note: string | null;
  }[];
}

export class GetShipmentStatusUseCase {
  constructor(
    private readonly shipmentRepository: IShipmentRepository,
    private readonly statusEventRepository: IShipmentStatusEventRepository
  ) {}

  async execute(trackingNumber: string): Promise<ShipmentStatusDto | null> {
    const shipment: Shipment | null =
      await this.shipmentRepository.findByTrackingNumber(trackingNumber);
    if (!shipment) return null;

    const events: ShipmentStatusEvent[] =
      await this.statusEventRepository.findByShipmentId(shipment.id!);

    return {
      id: shipment.id!,
      trackingNumber: shipment.trackingNumber,
      currentStatus: shipment.currentStatus,
      history: events.map((e) => ({
        status: e.status,
        occurredAt: e.occurredAt?.toISOString() ?? new Date().toISOString(),
        note: e.note ?? null,
      })),
    };
  }
}
