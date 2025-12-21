import {
  IShipmentRepository,
  ShipmentWithQuote,
} from "../repositories/shipment.repository";

export interface UserShipmentDto {
  id: number;
  trackingNumber: string;
  status: string;
  chargeableWeightKg: number;
  quotedPriceCents: number;
  createdAt: string;
}

export class GetUserShipmentsUseCase {
  constructor(private readonly shipmentRepository: IShipmentRepository) {}

  async execute(userId: number): Promise<UserShipmentDto[]> {
    const shipments: ShipmentWithQuote[] =
      await this.shipmentRepository.findByUserIdWithQuote(userId);

    return shipments.map((shipment) => ({
      id: shipment.id,
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      chargeableWeightKg: shipment.chargeableWeightKg,
      quotedPriceCents: shipment.quotedPriceCents,
      createdAt: shipment.createdAt.toISOString(),
    }));
  }
}
