import { IShipmentRepository } from "../repositories/shipment.repository";
import { IShipmentStatusEventRepository } from "../repositories/shipment-status-event.repository";
import { ShipmentStatusEvent } from "@domain/entities/shipment-status-event.entity";
import { ShipmentStatus } from "@domain/entities/quote.entity";
import { socketService } from "@infrastructure/services/socket.service";
import { shipmentSimulationService } from "@infrastructure/services/shipment-simulation.service";
import { Shipment } from "@domain/entities/shipment.entity";

const STATUS_FLOW: ShipmentStatus[] = ["EN_ESPERA", "EN_TRANSITO", "ENTREGADO"];

export class AdvanceShipmentStatusUseCase {
  constructor(
    private readonly shipmentRepository: IShipmentRepository,
    private readonly statusEventRepository: IShipmentStatusEventRepository
  ) {}

  async execute(shipmentId: number): Promise<ShipmentStatus | null> {
    const shipment: Shipment | null = await this.shipmentRepository.findById(
      shipmentId
    );
    if (!shipment) return null;

    const currentIndex = STATUS_FLOW.indexOf(shipment.currentStatus);
    if (currentIndex === -1 || currentIndex >= STATUS_FLOW.length - 1) {
      shipmentSimulationService.stopSimulation(shipmentId);
      return shipment.currentStatus;
    }

    const newStatus = STATUS_FLOW[currentIndex + 1]!;

    await this.shipmentRepository.updateStatus(shipmentId, newStatus);

    const event = new ShipmentStatusEvent({
      shipmentId,
      status: newStatus,
      note: `Estado actualizado a ${newStatus}`,
    });
    await this.statusEventRepository.create(event);

    socketService.emitStatusUpdate(shipmentId, {
      status: newStatus,
      occurredAt: new Date().toISOString(),
      note: event.note ?? null,
    });

    if (newStatus === "ENTREGADO") {
      shipmentSimulationService.stopSimulation(shipmentId);
    }

    return newStatus;
  }
}
