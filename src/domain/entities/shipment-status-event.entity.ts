import { ShipmentStatus } from "./quote.entity";

export interface ShipmentStatusEventProps {
  id?: number;
  shipmentId: number;
  status: ShipmentStatus;
  occurredAt?: Date;
  note?: string | null;
}

export class ShipmentStatusEvent {
  public readonly id?: number;
  public readonly shipmentId: number;
  public readonly status: ShipmentStatus;
  public readonly occurredAt?: Date;
  public readonly note?: string | null;

  constructor(props: ShipmentStatusEventProps) {
    this.id = props.id;
    this.shipmentId = props.shipmentId;
    this.status = props.status;
    this.occurredAt = props.occurredAt;
    this.note = props.note;
  }
}
