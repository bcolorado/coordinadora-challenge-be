import { IQuoteRepository } from "../repositories/quote.repository";
import { IShipmentRepository } from "../repositories/shipment.repository";
import { IShipmentStatusEventRepository } from "../repositories/shipment-status-event.repository";
import { Quote } from "@domain/entities/quote.entity";
import { Shipment } from "@domain/entities/shipment.entity";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";
import { TrackingNumberGenerator } from "@domain/services/tracking-number-generator.service";
import {
  CreateShipmentRequestDto,
  ShipmentResponseDto,
} from "@application/dtos/shipment.dto";

export class CreateShipmentUseCase {
  constructor(
    private readonly quoteRepository: IQuoteRepository,
    private readonly shipmentRepository: IShipmentRepository,
    private readonly shipmentStatusEventRepository: IShipmentStatusEventRepository
  ) {}

  async execute(
    input: CreateShipmentRequestDto,
    userId: number
  ): Promise<ShipmentResponseDto> {
    const quote = new Quote({
      userId,
      originLocationId: input.origin.id,
      destinationLocationId: input.destination.id,
      actualWeightKg: input.actualWeight,
      lengthCm: input.dimensions.length,
      widthCm: input.dimensions.width,
      heightCm: input.dimensions.height,
      volumetricWeightKg: input.volumetricWeight,
      chargeableWeightKg: input.chargeableWeight,
      shippingRateId: input.rate.id,
      quotedPriceCents: input.totalPriceCents,
    });

    const createdQuote = await this.quoteRepository.create(quote);

    const shipment = new Shipment({
      userId,
      quoteId: createdQuote.id!,
      trackingNumber: TrackingNumberGenerator.generate(),
      currentStatus: "EN_ESPERA",
    });

    const createdShipment = await this.shipmentRepository.create(shipment);

    const statusEvent = new ShipmentStatusEvent({
      shipmentId: createdShipment.id!,
      status: "EN_ESPERA",
      note: "Envío creado",
    });

    await this.shipmentStatusEventRepository.create(statusEvent);

    return {
      id: createdShipment.id!,
      trackingNumber: createdShipment.trackingNumber,
      status: createdShipment.currentStatus,
      origin: input.origin,
      destination: input.destination,
      quotedPriceCents: input.totalPriceCents,
      createdAt: new Date().toISOString(),
    };
  }
}
