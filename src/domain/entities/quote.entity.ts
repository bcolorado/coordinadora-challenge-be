export type ShipmentStatus = "EN_ESPERA" | "EN_TRANSITO" | "ENTREGADO";

export interface QuoteProps {
  id?: number;
  userId: number;
  originLocationId: number;
  destinationLocationId: number;
  actualWeightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  shippingRateId: number;
  quotedPriceCents: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Quote {
  public readonly id?: number;
  public readonly userId: number;
  public readonly originLocationId: number;
  public readonly destinationLocationId: number;
  public readonly actualWeightKg: number;
  public readonly lengthCm: number;
  public readonly widthCm: number;
  public readonly heightCm: number;
  public readonly volumetricWeightKg: number;
  public readonly chargeableWeightKg: number;
  public readonly shippingRateId: number;
  public readonly quotedPriceCents: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: QuoteProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.originLocationId = props.originLocationId;
    this.destinationLocationId = props.destinationLocationId;
    this.actualWeightKg = props.actualWeightKg;
    this.lengthCm = props.lengthCm;
    this.widthCm = props.widthCm;
    this.heightCm = props.heightCm;
    this.volumetricWeightKg = props.volumetricWeightKg;
    this.chargeableWeightKg = props.chargeableWeightKg;
    this.shippingRateId = props.shippingRateId;
    this.quotedPriceCents = props.quotedPriceCents;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
