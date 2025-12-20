export interface ShippingRateProps {
  id?: number;
  originLocationId: number;
  destinationLocationId: number;
  basePriceCents: number;
  pricePerKgCents: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ShippingRate {
  public readonly id?: number;
  public readonly originLocationId: number;
  public readonly destinationLocationId: number;
  public readonly basePriceCents: number;
  public readonly pricePerKgCents: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: ShippingRateProps) {
    this.id = props.id;
    this.originLocationId = props.originLocationId;
    this.destinationLocationId = props.destinationLocationId;
    this.basePriceCents = props.basePriceCents;
    this.pricePerKgCents = props.pricePerKgCents;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
