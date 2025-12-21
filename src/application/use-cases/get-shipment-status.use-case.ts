import { IShipmentRepository } from "../repositories/shipment.repository";
import { IShipmentStatusEventRepository } from "../repositories/shipment-status-event.repository";
import {
  IQuoteRepository,
  QuoteWithLocations,
} from "../repositories/quote.repository";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";
import { Shipment } from "@domain/entities/shipment.entity";

interface LocationInfo {
  id: number;
  cityName: string;
}

export interface ShipmentStatusDto {
  id: number;
  trackingNumber: string;
  currentStatus: string;
  origin: LocationInfo;
  destination: LocationInfo;
  actualWeightKg: number;
  chargeableWeightKg: number;
  quotedPriceCents: number;
  history: {
    status: string;
    occurredAt: string;
    note: string | null;
  }[];
}

export class GetShipmentStatusUseCase {
  constructor(
    private readonly shipmentRepository: IShipmentRepository,
    private readonly statusEventRepository: IShipmentStatusEventRepository,
    private readonly quoteRepository: IQuoteRepository
  ) {}

  async execute(trackingNumber: string): Promise<ShipmentStatusDto | null> {
    const shipment: Shipment | null =
      await this.shipmentRepository.findByTrackingNumber(trackingNumber);
    if (!shipment) return null;

    const quote: QuoteWithLocations | null =
      await this.quoteRepository.findByIdWithLocations(shipment.quoteId);
    if (!quote) return null;

    const events: ShipmentStatusEvent[] =
      await this.statusEventRepository.findByShipmentId(shipment.id!);

    return {
      id: shipment.id!,
      trackingNumber: shipment.trackingNumber,
      currentStatus: shipment.currentStatus,
      origin: quote.origin,
      destination: quote.destination,
      actualWeightKg: quote.actualWeightKg,
      chargeableWeightKg: quote.chargeableWeightKg,
      quotedPriceCents: quote.quotedPriceCents,
      history: events.map((e) => ({
        status: e.status,
        occurredAt: e.occurredAt?.toISOString() ?? new Date().toISOString(),
        note: e.note ?? null,
      })),
    };
  }
}
