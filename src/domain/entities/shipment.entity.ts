export type { ShipmentStatus } from "./quote.entity";
import { ShipmentStatus } from "./quote.entity";

export interface ShipmentProps {
  id?: number;
  userId: number;
  quoteId: number;
  trackingNumber: string;
  currentStatus: ShipmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Shipment {
  public readonly id?: number;
  public readonly userId: number;
  public readonly quoteId: number;
  public readonly trackingNumber: string;
  public readonly currentStatus: ShipmentStatus;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: ShipmentProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.quoteId = props.quoteId;
    this.trackingNumber = props.trackingNumber;
    this.currentStatus = props.currentStatus;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
