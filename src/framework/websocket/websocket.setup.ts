import { Server } from "socket.io";
import { shipmentSimulationService } from "@infrastructure/services/shipment-simulation.service";
import {
  advanceShipmentStatusUseCase,
  shipmentRepository,
} from "@adapters/di/container";

export function setupWebSocket(io: Server): void {
  shipmentSimulationService.setStatusUpdateCallback(async (shipmentId) => {
    await advanceShipmentStatusUseCase.execute(shipmentId);
  });

  io.on("connection", (socket) => {
    socket.on("join_shipment", async ({ shipmentId }) => {
      const shipment = await shipmentRepository.findById(shipmentId);
      if (shipment && shipment.currentStatus !== "ENTREGADO") {
        shipmentSimulationService.startSimulation(
          shipmentId,
          shipment.currentStatus
        );
      }
    });

    socket.on("leave_shipment", ({ shipmentId }) => {
      shipmentSimulationService.stopSimulation(shipmentId);
    });
  });
}
