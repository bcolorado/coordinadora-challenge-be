import { ShipmentStatus } from "@domain/entities/quote.entity";

const STATUS_FLOW: ShipmentStatus[] = ["EN_ESPERA", "EN_TRANSITO", "ENTREGADO"];
const SIMULATION_INTERVAL_MS = 15000;

type StatusUpdateCallback = (
  shipmentId: number,
  newStatus: ShipmentStatus
) => Promise<void>;

class ShipmentSimulationService {
  private activeSimulations: Map<number, NodeJS.Timeout> = new Map();
  private onStatusUpdate: StatusUpdateCallback | null = null;

  setStatusUpdateCallback(callback: StatusUpdateCallback): void {
    this.onStatusUpdate = callback;
  }

  startSimulation(shipmentId: number, currentStatus: ShipmentStatus): void {
    if (this.activeSimulations.has(shipmentId)) {
      return;
    }

    if (currentStatus === "ENTREGADO") {
      return;
    }

    const timer = setInterval(async () => {
      await this.advanceStatus(shipmentId);
    }, SIMULATION_INTERVAL_MS);

    this.activeSimulations.set(shipmentId, timer);
    console.log(`Simulation started for shipment ${shipmentId}`);
  }

  stopSimulation(shipmentId: number): void {
    const timer = this.activeSimulations.get(shipmentId);
    if (timer) {
      clearInterval(timer);
      this.activeSimulations.delete(shipmentId);
      console.log(`Simulation stopped for shipment ${shipmentId}`);
    }
  }

  private async advanceStatus(shipmentId: number): Promise<void> {
    if (this.onStatusUpdate) {
      try {
        await this.onStatusUpdate(shipmentId, this.getNextStatus("EN_ESPERA"));
      } catch (error) {
        console.error(`Error advancing status for ${shipmentId}:`, error);
        this.stopSimulation(shipmentId);
      }
    }
  }

  getNextStatus(currentStatus: ShipmentStatus): ShipmentStatus {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= STATUS_FLOW.length - 1) {
      return currentStatus;
    }
    return STATUS_FLOW[currentIndex + 1]!;
  }

  isSimulationActive(shipmentId: number): boolean {
    return this.activeSimulations.has(shipmentId);
  }
}

export const shipmentSimulationService = new ShipmentSimulationService();
